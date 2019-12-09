import {html, render} from "./web_modules/lit-html.js";

let sites = {
    'src': 'https://github.com/tmcmaster/tm-magnify-image',
    'pika': 'https://www.pika.dev/npm/@wonkytech/tm-magnify-image',
    'npm': 'https://www.npmjs.com/package/@wonkytech/tm-magnify-image',
    'docs': 'https://github.com/tmcmaster/tm-magnify-image#readme'
};

render(html`
    <style>
        body {
          background-color: lightgray;
          padding: 0;
          margin: 0;
        } 
        img {
            width: 500px;
            height: 500px;
        }
    </style>
    <tm-examples heading="Magnify Image" .sites="${sites}">
        <section title="Magnify Image">
            <tm-magnify-image><img src="images/colourful-grid.png"/></tm-magnify-image>
        </section>
    </tm-examples>
`, document.querySelector('body'));