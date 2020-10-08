import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Root from './html_components/Root';
import * as serviceWorker from './serviceWorker';
import Pico from './utils/PicoV3';

let pico = new Pico();
ReactDOM.render(<Root pico={pico} />, document.getElementById('root'));

serviceWorker.register();
