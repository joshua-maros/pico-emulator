// src/utils/PicoMessage.js - A message box for the processor
// PicoMessage items have the following:
//    An ID to locate the item
//    A location on the screen
//    A message
//    A flag indicating error or not
//    A width
//    A key for the MessageView
import React from 'react';
import MessageView from '../components/MessageView';

class PicoMessage
{
	constructor(id, key, x, y, wid, callback)
	{
		this.id = id;
    this.key = key;
    this.message = '';
    this.err = false;
    this.x = x;
    this.y = y;
    this.wid = wid;
		this.callback = callback;
	};

	// Set the value of the message
	set_message(msg, err)
	{
		this.message = msg;
    this.err = err;
	};

  clear_message()
  {
    this.message = '';
    this.err = false;
  }

  // Build the implementation of the register (a MessageView component)
  implement()
  {
		if (this.callback !== null)
		{
			this.message = this.callback();
		}
    return ( <MessageView x={this.x} y={this.y} key={this.key} wid={this.wid} err={this.err} message={this.message} />);
  }
};

export default PicoMessage;
