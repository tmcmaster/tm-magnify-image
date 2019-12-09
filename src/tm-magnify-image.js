import {html, css, LitElement} from 'lit-element';

import {addListener} from "@polymer/polymer/lib/utils/gestures";

window.customElements.define('tm-magnify-image', class extends LitElement {

    // noinspection JSUnusedGlobalSymbols
    static get properties() {
        return {
            zoom: {type: Number},
            ratioX: {type: Number},
            ratioY: {type: Number},
            ratioSize: {type: Number}
        }
    }

    constructor() {
        super();
        this.zoom = 2;
        this.ratioX = 0.5;
        this.ratioY = 0.5;
        this.ratioSize = 0.3;
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
                //border: 3px solid #000;
                border-radius: 50%;
                cursor: none;
                z-index: 2;
            }
        `;
    }

    // noinspection JSUnusedGlobalSymbols
    render() {
        return html`
            <slot id="slot"></slot>
            <div id="magnified-image"></div>
        `;
    }

    firstUpdated(_changedProperties) {
        this.mag = this.shadowRoot.getElementById('magnified-image');
        const images = this.shadowRoot.getElementById('slot').assignedNodes().filter(el => el.tagName === 'IMG');
        if (images.length > 0) {
            this.img = images[0];
            this.positionMagifyingGlass();
            addListener(this.mag, 'track', (e) => {
                const {dx, dy, x, y} = e.detail;
                console.log(dx, dy);
                this.ratioX = x / this.img.width;
                this.ratioY = y / this.img.height;
                this.positionMagifyingGlass();
            });
        }

    }

    positionMagifyingGlass() {
        const {img, mag, zoom, ratioX, ratioY, ratioSize} = this;

        const magImageWidth = (img.width * zoom);
        const magImageHeight = (img.height * zoom);
        const magDivWidth = (ratioSize * 100);
        const magDivHeight = (ratioSize * 100);
        const magDivTop = (ratioY * 100) - (magDivHeight / 2);
        const magDivLeft = (ratioX * 100) - (magDivWidth / 2);

        const magDivImageOffsetLeft = magImageWidth * magDivLeft / 100 + (ratioSize/2*img.width);
        const magDivImageOffsetTop = magImageHeight * magDivTop / 100 + (ratioSize/2*img.height);

        mag.style.top = magDivTop + "%";
        mag.style.left = magDivLeft + "%";
        mag.style.width = magDivWidth + "%";
        mag.style.height = magDivHeight + "%";

        console.log('Size ', magImageWidth + "px " + magImageHeight + "px");

        mag.style.backgroundSize = magImageWidth + "px " + magImageHeight + "px";
        mag.style.backgroundImage = "url('" + img.src + "')";
        mag.style.backgroundRepeat = "no-repeat";
        mag.style.backgroundPosition = `-${magDivImageOffsetLeft}px -${magDivImageOffsetTop}px`;
        //mag.style.backgroundPosition = "-" + (magDivTop*img.width*zoom) + "% -" + (magDivLeft*img.height*zoom) + "%";

        console.log('Image: ', mag.style.backgroundImage);
    }
});
