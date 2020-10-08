import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Proc from './containers/Proc';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Proc />, document.getElementById('root'));

serviceWorker.register();
