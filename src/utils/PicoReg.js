// src/utils/PicoReg.js - A register for the processor
// PicoReg items have the following:
//    An ID to locate the item
//    A label
//    A location on the screen
//    A value
//    A key for the RegView
import React from 'react';
import RegView from '../components/RegView';

class PicoReg
{
	constructor(processor, id, key, label, x, y)
	{
		this.processor = processor;
		this.id = id;
    this.key = key;
    this.label = label;
    this.x = x;
    this.y = y;
    this.value = '';

		this.setMyValue = this.setMyValue.bind(this);
		this.handleClick = this.handleClick.bind(this);
	};

	// This is called when the Value Editor submit is pressed
	setMyValue(value)
	{
		this.value = value;
		this.processor.rebuild();
	}

	// This is called when the person clicks on the latch in the view.
	// It sets the Value Editor to point to this latch
  handleClick()
  {
		this.processor.set_watch(this.label, this.value, this.setMyValue);
  }

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
    return ( <RegView
								x={this.x}
								y={this.y}
								key={this.key}
								label={this.label}
								value={this.value}
								callback={this.handleClick}
							/>);
  }
};

export default PicoReg;
