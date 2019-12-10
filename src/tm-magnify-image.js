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
                //border: solid gray 1px;
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
            <slot id="slot"></slot>
            <div id="magnified-image"></div>
            <img id="magnify-glass" src="images/magnifying-glass.png"/>
        `;
    }

    firstUpdated(_changedProperties) {
        this.mag = this.shadowRoot.getElementById('magnified-image');
        this.glass = this.shadowRoot.getElementById('magnify-glass');
        const images = this.shadowRoot.getElementById('slot').assignedNodes().filter(el => el.tagName === 'IMG');
        let offsetX = 0, offsetY = 0;

        if (images.length > 0) {
            this.img = images[0];
            setTimeout( () => {
                this.positionMagifyingGlass();
            }, 100);
            //this.positionMagifyingGlass(); // TODO: need to review why this is required
            if (this.draggable) {
                addListener(this.glass, 'down', (e) => {
                    const {x, y} = e.detail;
                    offsetX = x - this.mag.offsetLeft - this.glass.width*this.ratioSize;
                    offsetY = y - this.mag.offsetTop - this.glass.height*this.ratioSize;
                    //console.log('Offset', offsetX, offsetY);
                });
                let count = 0;
                addListener(this.glass, 'track', (e) => {
                    //console.log('Move', e);
                    const {x, y} = e.detail;
                    // TODO: remove the need for the static -0.5
                    const newRatioX = (x-offsetX) / this.img.width -0.5;
                    const newRatioY = (y-offsetY) / this.img.height -0.5;
                    if (++count % 50 === 0) console.log(`Ratio X(${newRatioX}), Y(${newRatioY})`);
                    this.ratioX = (newRatioX < 0 ? 0 : (newRatioX > 1 ? 1 : newRatioX));
                    this.ratioY = (newRatioY < 0 ? 0 : (newRatioY > 1 ? 1 : newRatioY));

                    this.positionMagifyingGlass();
                });
            }
        }
    }

    positionMagifyingGlass() {
        //console.log('Positioning Magnifying Glass');
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


        //console.log('MagImageOffset', magImageOffsetX, magImageOffsetY);

        // const magDivWidth = (ratioSize * 100);
        // const magDivHeight = (ratioSize * 100);

        // const magImageTop = -((magWidth - img.width)/2);
        // const magImageLeft = -((magHeight - img.height)/2);
        //
        // const magDivImageOffsetLeft = -((magWidth - img.width)/2);
        // const magDivImageOffsetTop = -((magHeight - img.height)/2);

        //const glassImageRatio =
        const glassWidth = magDivSize * 2.52;
        const glassHeight = glassWidth * glassAspectRatio;

        const glassLeft = magDivLeft - (0.11*glassWidth);
        const glassTop = magDivTop - (0.11*glassHeight);

        mag.style.top = magDivTop + "px";
        mag.style.left = magDivLeft + "px";

        mag.style.width = magDivSize + "px";
        mag.style.height = magDivSize + "px";

        //console.log('Size ', magImageWidth + "px " + magImageHeight + "px");

        mag.style.backgroundSize = magImageWidth + "px " + magImageHeight + "px";
        mag.style.backgroundImage = "url('" + img.src + "')";
        mag.style.backgroundRepeat = "no-repeat";
        //mag.style.backgroundPosition = `250px 250px`;
        mag.style.backgroundPosition = `${magImageOffsetX}px ${magImageOffsetY}px`;

        glass.style.width = glassWidth + "px";
        glass.style.top = glassTop + "px";
        glass.style.left = glassLeft + "px";
        //glass.style.display = 'none';
    }
});
