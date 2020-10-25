import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Root from './html_components/Root';
import * as serviceWorker from './serviceWorker';
import { Datapath } from './logic/datapath';
import { PICO } from './logic/pico';

const datapath = new Datapath();
datapath.loadDef(PICO);
ReactDOM.render(<Root datapath={datapath} />, document.getElementById('root'));

serviceWorker.register();
