// src/utils/PicoButton.js - A button to control the processor
// PicoButton items have the following:
//    A label
//    A location on the screen
//    A call-back
//    A key for the RegView
//		A width for the RegView
import React from 'react';
import ButtonView from '../components/ButtonView';

class PicoButton
{
	constructor(key, label, x, y, wid, callback)
	{
    this.key = key;
    this.label = label;
    this.x = x;
    this.y = y;
		this.wid = wid;
    this.callback = callback;
	};

  /*
   * Build the implementation of the register (a RegView component)
   */
  implement()
  {
    return ( <ButtonView x={this.x} y={this.y} wid={this.wid} key={this.key} label={this.label} callback={this.callback} />);
  }
};

export default PicoButton;
