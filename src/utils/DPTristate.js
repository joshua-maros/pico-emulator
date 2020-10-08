// src/utils/DPTristate.js - A tristate driver for the datapath view
import React from 'react';
import TristateView from '../components/TristateView';

class DPTristate
{
	constructor(processor, id, key, x, y, flip)
	{
    this.processor = processor;
		this.id = id;
    this.key = key;
    this.x = x;
    this.y = y;
    this.flip = flip;

		// We do not yet have the connections
    this.connectIn = null;
    this.connectEnable = null;
		this.connectOut = null;
	};

	// Add a connection
	connectToPin(connector, pinName)
	{
    if (pinName === 'In')
		{
			this.connectIn = connector;
			connector.set_location(this.x + (this.flip ? 30 : 0), this.y + 20);
			return;
		}
    if (pinName === 'Enable')
		{
			this.connectEnable = connector;
			connector.set_location(this.x + 15, this.y + 30);
			return;
		}
		if (pinName === 'Out')
		{
			this.connectOut = connector;
			connector.set_location(this.x + (this.flip ? 0 : 30), this.y + 20);
			return;
		}
		this.processor.add_error('A DPTristate gate does not have a pin named ' + pinName);
	}

	// We don't do anything to begin the eval of a control.
	begin_eval()
	{
		// EMPTY
	}

	// Evaluate this gate:
	eval()
	{
        // Only eval if this is connected.
        if (this.connectIn === null || this.connectEnable === null || this.connectOut === null)
        {
            return;
        }
        const enable = this.connectEnable.use_value();
        if (enable === 'Conflict' || enable === 'Unknown')
        {
            this.connectOut.set_value('Unknown');
            return;
        }
        if (enable === true)
        {
            this.connectOut.set_value(this.connectIn.use_value());
            return;
        }
        if (enable === false)
        {
            this.connectOut.clear_value();
            return;
        }
        this.processor.add_error('Evaluating DPTristate ' + this.id + ': Enable input has value ' + enable);
	}

	// We don't do anything to end the eval of a control.
	end_eval()
	{
		// EMPTY
	}

  // Build the implementation of the control (a MuxView component)
  implement()
  {
    return ( <TristateView
                x={this.x}
                y={this.y}
                key={this.key}
                flip={this.flip}
              />);
  }
};

export default DPTristate;
