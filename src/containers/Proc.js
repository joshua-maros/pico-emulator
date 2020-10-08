// src/containers/Proc.js

import React, {Component} from 'react';
import App from '../App';
import Processor from '../utils/processor.js';
import PicoMain from '../utils/PicoMain.js';

var theProcessor = new Processor();
PicoMain(theProcessor);

class Proc extends Component
{
  render()
	{
		return ( <App processor={theProcessor} /> );
	}
};

export default Proc;
