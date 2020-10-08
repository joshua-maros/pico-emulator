// src/utils/PicoFlag.js - A flag (bit) for the processor
// PicoFlag items have the following:
//    An ID to locate the item
//    A label
//    A location on the screen
//    A value
//    A key for the FlagView
import React from 'react';
import FlagView from '../components/FlagView';

class PicoFlag
{
	constructor(id, key, label, x, y)
	{
		this.id = id;
    this.key = key;
    this.label = label;
    this.x = x;
    this.y = y;
    this.value = false;
	};

	/*
	 * Set the value of the register
	 */
	set_value(val)
	{
		this.value = val;
	};

  /*
   * Return the value of the register
   */
  get_value()
  {
    return this.value;
  }

  /*
   * Build the implementation of the register (a RegView component)
   */
  implement()
  {
    return ( <FlagView x={this.x} y={this.y} key={this.key} label={this.label} value={this.value} />);
  }
};

export default PicoFlag;
