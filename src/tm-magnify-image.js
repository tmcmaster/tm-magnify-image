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
                //border: 3px solid #000;
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
                    offsetY = y - this.mag.offsetTop - this.glass.width*this.ratioSize;
                    //console.log('Offset', offsetX, offsetY);
                });
                addListener(this.glass, 'track', (e) => {
                    //console.log('Move', e);
                    const {x, y} = e.detail;
                    //console.log('Offset', offsetX, offsetY);
                    const newRatioX = (x-offsetX) / this.img.width;
                    const newRatioY = (y-offsetY) / this.img.height;
                    this.ratioX = (newRatioX < 0 ? 0 : (newRatioX > 1 ? 1 : newRatioX));
                    this.ratioY = (newRatioY < 0 ? 0 : (newRatioY > 1 ? 1 : newRatioY));

                    this.positionMagifyingGlass();
                });
            }
        }
    }

    positionMagifyingGlass() {
        console.log('Positioning Magnifying Glass');
        const {img, mag, glass, zoom, ratioX, ratioY, ratioSize} = this;

        const magImageWidth = (img.width * zoom);
        const magImageHeight = (img.height * zoom);
        const magDivWidth = (ratioSize * 100);
        const magDivHeight = (ratioSize * 100);
        const magDivTop = (ratioY * 100) - (magDivHeight / 2);
        const magDivLeft = (ratioX * 100) - (magDivWidth / 2);

        const magDivImageOffsetLeft = magImageWidth * magDivLeft / 100 + (ratioSize/2*img.width);
        const magDivImageOffsetTop = magImageHeight * magDivTop / 100 + (ratioSize/2*img.height);

        const glassWidth = magDivWidth * 2.52;
        const glassTop = magDivTop - (glassWidth*0.1);
        const glassLeft = magDivLeft - (glassWidth*0.1);

        mag.style.top = magDivTop + "%";
        mag.style.left = magDivLeft + "%";
        mag.style.width = magDivWidth + "%";
        mag.style.height = magDivHeight + "%";

        console.log('Size ', magImageWidth + "px " + magImageHeight + "px");

        mag.style.backgroundSize = magImageWidth + "px " + magImageHeight + "px";
        mag.style.backgroundImage = "url('" + img.src + "')";
        mag.style.backgroundRepeat = "no-repeat";
        mag.style.backgroundPosition = `-${magDivImageOffsetLeft}px -${magDivImageOffsetTop}px`;

        glass.style.width = glassWidth + "%";
        glass.style.top = glassTop + "%";
        glass.style.left = glassLeft + "%";
    }
});
