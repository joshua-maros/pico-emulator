// src/utils/DPExpand.js - An expander/reducer for the datapath view
import React from 'react';
import ExpandView from '../components/ExpandView';
import AsUnsignedNBits from './AsUnsignedNBits';

class DPExpand
{
	constructor(processor, id, key, x, y, inNBits, outNBits, extend)
	{
    this.processor = processor;
		this.id = id;
    this.key = key;
    this.x = x;
    this.y = y;
    this.inNBits = inNBits;
    this.outNBits = outNBits;
    this.extend = extend;

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
			connector.set_location(this.x, this.y + 25);
			return;
		}
		if (pinName === 'Out')
		{
			this.connectOut = connector;
			connector.set_location(this.x + 20, this.y + 25);
			return;
		}
		this.processor.add_error('A DPExpand gate does not have a pin named ' + pinName);
	}

	// We don't do anything to begin the eval of an expander.
	begin_eval()
	{
		// EMPTY
	}

	// Evaluate this gate:
	eval()
	{
        // Only eval if this is connected.
        if (this.connectIn === null || this.connectOut === null)
        {
            return;
        }
        const inVal = AsUnsignedNBits(this.connectIn.get_value(), this.inNBits);
        if (inVal === 'Conflict' || inVal === 'Unknown')
        {
            this.connectOut.set_value('Unknown');
            return;
        }
        let outVal = AsUnsignedNBits(inVal, this.outNBits);
        if (this.outNBits > this.inNBits && this.extend)
        {
            // We need to sign-extend the number.
            const signBit = 1 << (this.inNBits - 1);
            if ((inVal & signBit) !== 0)
            {
                let bits = (1 << this.outNBits) - (1 << this.inNBits);
                outVal |= bits;
            }
        }
        this.connectOut.set_value(outVal);
        if (this.connectOut.is_used())
        {
            this.connectIn.use_value();
        }
	}

	// We don't do anything to end the eval of an expander.
	end_eval()
	{
		// EMPTY
	}

  // Build the implementation of the expander
  implement()
  {
    return ( <ExpandView
                x={this.x}
                y={this.y}
                key={this.key}
              />);
  }
};

export default DPExpand;
