import {html, css, LitElement} from 'lit-element';

import {addListener} from "@polymer/polymer/lib/utils/gestures";

window.customElements.define('tm-magnify-image', class extends LitElement {

    // noinspection JSUnusedGlobalSymbols
    static get properties() {
        return {
            zoom: {type: Number},
            ratioX: {type: Number},
            ratioY: {type: Number},
            ratioSize: {type: Number},
            draggable: {type: Boolean}
        }
    }

    constructor() {
        super();
        this.zoom = 2;
        this.ratioX = 0.5;
        this.ratioY = 0.5;
        this.ratioSize = 0.3;
        this.draggable = false;
    }

    static get styles() {
        // language=CSS
        return css `
            :host {
                display: inline-block;
                box-sizing: border-box;
                border: solid gray 1px;
                position: relative;
                z-index: 1;
            }
            #magnified-image {
                display: block;
                position: absolute;
                /*top:100px;*/
                /*left:100px;*/
                /*width: 300px;*/
                /*height: 300px;*/
                box-sizing: border-box;
                border-radius: 50%;
                cursor: none;
                z-index: 2;
            }
            #magnify-glass {
                display: block;
                position: absolute;
                z-index: 3;
                //display: none;
                box-sizing: border-box;
                //border: solid darkblue 2px;
                -webkit-user-drag: none;
            }
        `;
    }

    // noinspection JSUnusedGlobalSymbols
    render() {
        return html`
            <slot id="slot" @slotchange=${this}></slot>
            <div id="magnified-image"></div>
            <img id="magnify-glass" src="images/magnifying-glass.png"/>
        `;
    }

    // TODO: change this to an explicit function call in @slotchange
    // noinspection JSUnusedGlobalSymbols
    handleEvent(event) {
        //console.log(`Slot change event slot`);
        const images = this.shadowRoot.getElementById('slot').assignedNodes().filter(el => el.tagName === 'IMG');
        if (images.length > 0) {
            let counter = 0;
            const image = images[0];
            this.img = image;
            const interval = setInterval(() => {
                if (image.width > 0) {
                    console.log('Image Width: ' + image.width);
                    clearInterval(interval);
                    this.dispatchEvent(new CustomEvent('image-loaded'));
                } else {
                    if (++counter % 10 === 0) console.log('Still waiting on image: ' + image.src);
                    if (counter > 100) {
                        console.warn('Image took too long to load: ' + image.src);
                        clearInterval(interval);
                    }
                }
            }, 100);
        }
    }

    // noinspection JSUnusedGlobalSymbols
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('image-loaded', () => {this._initialiseMagnifyingGlass()});
        document.addEventListener('refresh-components', () => {this._initialiseMagnifyingGlass()});
    }

    // noinspection JSUnusedGlobalSymbols
    disconnectedCallback() {
        this.removeEventListener('image-loaded', () => {this._initialiseMagnifyingGlass()});
        document.removeEventListener('refresh-components', () => {this._initialiseMagnifyingGlass()})
        super.disconnectedCallback();
    }

    // noinspection JSUnusedGlobalSymbols
    firstUpdated(_changedProperties) {
        this.mag = this.shadowRoot.getElementById('magnified-image');
        this.glass = this.shadowRoot.getElementById('magnify-glass');

        let offsetX = 0, offsetY = 0;
        if (this.draggable) {
            addListener(this.glass, 'down', (e) => {
                const {x, y} = e.detail;
                const imageRect = this.mag.getBoundingClientRect();

                const magCenterX = this.img.width/2 * this.ratioSize;
                const magCenterY = this.img.width/2 * this.ratioSize;
                const magGrabX = x - imageRect.x;
                const magGrabY = y - imageRect.y;

                offsetX = magCenterX - magGrabX;
                offsetY = magCenterY - magGrabY;
            });
            addListener(this.glass, 'track', (e) => {
                const {x, y} = e.detail;

                const imageRect = this.img.getBoundingClientRect();
                const newRatioX = (x-imageRect.x+offsetX) / this.img.width;
                const newRatioY = (y-imageRect.y+offsetY) / this.img.height;

                this.ratioX = (newRatioX < 0 ? 0 : (newRatioX > 1 ? 1 : newRatioX));
                this.ratioY = (newRatioY < 0 ? 0 : (newRatioY > 1 ? 1 : newRatioY));

                this.positionMagnifyingGlass();
            });
        }
    }

    _initialiseMagnifyingGlass() {
        const {img, mag} = this;

        console.log('initialising the magnifying glass');

        if (this.img === undefined) return;

        console.log('initialising the magnifying glass: ', img.src, img.width, img.height);

        mag.style.backgroundImage = "url('" + img.src + "')";
        mag.style.backgroundRepeat = "no-repeat";

        this.positionMagnifyingGlass();
    }

    positionMagnifyingGlass() {
        const {img, mag, glass, zoom, ratioX, ratioY, ratioSize} = this;

        const imgWidth = img.width;
        const imgHeight = img.height;
        const imgLeft = 0;
        const imgTop = 0;

        const ratio = ratioSize / zoom;

        const glassAspectRatio = 567/756;

        const magImageWidth = (imgWidth * zoom);
        const magImageHeight = (imgHeight * zoom);
        const magImageLeft = imgLeft - ((imgWidth-magImageWidth)/2) + imgWidth*ratioX;
        const magImageTop = imgTop - ((imgHeight-magImageHeight)/2) + imgHeight*ratioY;

        const magDivSize = imgWidth * ratioSize;
        const magDivLeft = imgWidth * ratioX - (magDivSize/2);
        const magDivTop = imgHeight * ratioY - (magDivSize/2);

        const magImageOffsetX = -(magImageWidth*ratioX-imgWidth*ratioX)-magDivLeft;
        const magImageOffsetY = -(magImageHeight*ratioY-imgHeight*ratioY)-magDivTop;

        const glassWidth = magDivSize * 2.52;
        const glassHeight = glassWidth * glassAspectRatio;

        const glassLeft = magDivLeft - (0.11*glassWidth);
        const glassTop = magDivTop - (0.11*glassHeight);

        // console.log('Variables: ', JSON.stringify({
        //     mag: {
        //         left: magDivLeft,
        //         top: magDivTop,
        //         width: magDivSize,
        //         height: magDivSize
        //     },
        //     img: {
        //         left: imgLeft,
        //         top: imgTop,
        //         width: imgWidth,
        //         height: imgHeight
        //     },
        //     glass: {
        //         left: glassLeft,
        //         top: glassTop,
        //         width: glassWidth,
        //         height: glassHeight
        //     }
        // }));

        mag.style.top = magDivTop + "px";
        mag.style.left = magDivLeft + "px";

        mag.style.width = magDivSize + "px";
        mag.style.height = magDivSize + "px";

        mag.style.backgroundSize = magImageWidth + "px " + magImageHeight + "px";
        mag.style.backgroundPosition = `${magImageOffsetX}px ${magImageOffsetY}px`;

        glass.style.width = glassWidth + "px";
        glass.style.top = glassTop + "px";
        glass.style.left = glassLeft + "px";
    }
});
