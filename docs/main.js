import {html, render} from "./web_modules/lit-html.js";

import './web_modules/@wonkytech/tm-examples.js';

let sites = {
    'src': 'https://github.com/tmcmaster/tm-magnify-image',
    'pika': 'https://www.pika.dev/npm/@wonkytech/tm-magnify-image',
    'npm': 'https://www.npmjs.com/package/@wonkytech/tm-magnify-image',
    'docs': 'https://github.com/tmcmaster/tm-magnify-image#readme'
};

render(html`
    <style>
        body {
          padding: 0;
          margin: 0;
        } 
        img {
            width: 500px;
            height: 500px;
        }
        tm-magnify-image {
            margin: 100px;
        }
    </style>
    <tm-examples heading="Magnify Image" .sites="${sites}">
        <section title="Draggable">
            <tm-magnify-image draggable>
                <img src="images/colourful-grid.png"/>
            </tm-magnify-image>
        </section>
        <section title="Fixed">
            <tm-magnify-image>
                <img src="images/colourful-grid.png"/>
            </tm-magnify-image>
        </section>
        <section title="Smaller">
            <tm-magnify-image ratioSize="0.2">
                <img src="images/colourful-grid.png"/>
            </tm-magnify-image>
        </section>
    </tm-examples>
`, document.querySelector('body'));