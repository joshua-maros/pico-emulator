// src/utils/DPIncrementer.js - An incrementer for the datapath view
import React from 'react';
import IncrementerView from '../components/IncrementerView';
import AsUnsignedNBits from './AsUnsignedNBits';

class DPIncrementer
{
	constructor(processor, id, key, x, y, nbits, constant)
	{
    this.processor = processor;
		this.id = id;
    this.key = key;
    this.x = x;
    this.y = y;
    this.nbits = nbits;
    this.constant = constant;

    this.value = 'Unknown';

		// We do not yet have the connections
    this.connectIn = null;
		this.connectOut = null;
	};

	// Add a connection
	connectToPin(connector, pinName)
	{
    if (pinName === 'In')
		{
			this.connectIn = connector;
			connector.set_location(this.x, this.y + 15);
			return;
		}
		if (pinName === 'Out')
		{
			this.connectOut = connector;
			connector.set_location(this.x + 30, this.y + 15);
			return;
		}
		this.processor.add_error('A DPIncrementer gate does not have a pin named ' + pinName);
	}

	// We don't do anything to begin the eval of an incrementer.
	begin_eval()
	{
		// EMPTY
	}

	// Evaluate this gate.  We constantly load the input value,
  // add the constant, and send this to the output.  The incrementer assumes
  // the value is unsigned.
	eval()
	{
        // Only eval if this is connected.
        if (this.connectIn === null || this.connectOut === null)
        {
            return;
        }
        let inval = AsUnsignedNBits(this.connectIn.get_value(), this.nbits);
        if (inval === 'Conflict' || inval === 'Unknown')
        {
            this.value = 'Unknown';
        }
        else
        {
            this.value = AsUnsignedNBits(inval + this.constant, this.nbits);
        }
        this.connectOut.set_value(this.value);
        if (this.connectOut.is_used())
        {
            this.connectIn.use_value();
        }
	}

	// We don't do anything at the end of an eval.
	end_eval()
	{
    // EMPTY
	}

  // Build the implementation of the control (a MuxView component)
  implement()
  {
    return ( <IncrementerView
                x={this.x}
                y={this.y}
                key={this.key}
                value={this.value}
                constant={this.constant}
              />);
  }
};

export default DPIncrementer;
