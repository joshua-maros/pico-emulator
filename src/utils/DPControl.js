// src/utils/DPControl.js - A control input for the datapath view
import React from 'react';
import ControlView from '../components/ControlView';

class DPControl
{
	constructor(processor, id, key, label, x, y, wid, top, callback, buttonID, name, options)
	{
    this.processor = processor;
		this.id = id;
    this.key = key;
    this.label = label;
    this.x = x;
    this.y = y;
		this.wid = wid;
		this.top = top;
    this.callback = callback;
    this.buttonID = buttonID;
    this.name = name;
		this.options = options;

		// Tell the processor about this control
		processor.add_control(name, options);

		// We do not yet have the output connection
		this.connectOut = null;
	};

	// Add a connection
	connectToPin(connector, pinName)
	{
		if (pinName === 'Out')
		{
			this.connectOut = connector;
			if (this.top)
			{
				connector.set_location(this.x + this.wid / 2, this.y);
			}
			else
			{
				connector.set_location(this.x + this.wid, this.y + 10);
			}
			return;
		}
		this.processor.add_error('A DPControl gate does not have a pin named ' + pinName);
	}

	// We don't do anything to begin the eval of a control.
	begin_eval()
	{
		// EMPTY
	}

	// Evaluate this gate:
	eval()
	{
		const value = this.processor.get_dp_control(this.name);
		if (this.connectOut)
		{
			if (this.options.length > 0)
			{
				if (value === 0)
				{
					this.connectOut.set_value('Unknown');
				}
				else
				{
					this.connectOut.set_value(this.options[value]);
				}
			}
			else
			{
				this.connectOut.set_value(value);
			}
		}
	}

	// We don't do anything to end the eval of a control.
	end_eval()
	{
		// EMPTY
	}

  // Build the implementation of the control (a ControlView component)
  implement()
  {
    let flag = this.processor.get_dp_control(this.name);
		let label = this.label;
		if (this.options.length > 0)
		{
			label = this.options[flag];
			flag = (flag !== 0);
		}
    return ( <ControlView
                x={this.x}
                y={this.y}
                wid={this.wid}
                key={this.key}
                label={label}
                callback={this.callback}
                buttonID={this.buttonID}
								ctrlName={this.name}
                active={flag}
              />);
  }
};

export default DPControl;
