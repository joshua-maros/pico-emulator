// src/utils/DPLatch.js - A latch for the datapath view
import React from 'react';
import LatchView from '../components/LatchView';
import AsNBits from './AsNBits';

// The 'Load' input is optional
class DPLatch
{
	constructor(processor, id, key, label, x, y, nbits, powerOnReset, isIR)
	{
    this.processor = processor;
		this.id = id;
    this.key = key;
		this.label = label;
    this.x = x;
    this.y = y;
    this.nbits = nbits;
		this.powerOnReset = powerOnReset;
		this.isIR = isIR;

    this.value = 'Unknown';
		this.opcode = null;

		// We do not yet have the connections
    this.connectIn = null;
    this.connectLoad = null;
		this.connectOut = null;

		this.setMyValue = this.setMyValue.bind(this);
		this.handleClick = this.handleClick.bind(this);
	};

	// If this latch is the IR, we do some special things when its value
	// is loaded.
	// This routine is passed the value going into the latch.  It returns the
	// value to be stored in the latch's value.
	handleIR(val)
	{
		if (this.isIR)
		{
			if (typeof(val) === "string")
			{
				const arr = val.split(' ');
				this.opcode = arr[0];
				if (arr.length > 1)
				{
					val = AsNBits(arr[1], this.nbits);
				}
				else
				{
					val = 0;
				}
			}
			else
			{
				this.opcode = 'NOP';
				val = 0;
			}
			this.processor.set_opcode(this.opcode);
		}
		else
		{
			val = AsNBits(val, this.nbits);
		}
		return val;
	}

	// This is called when the Value Editor submit is pressed
	setMyValue(value)
	{
		this.value = this.handleIR(value);
		this.processor.rebuild();
	}

	// This is called when the person clicks on the latch in the view.
	// It sets the Value Editor to point to this latch
  handleClick()
  {
		this.processor.set_watch(this.label, this.value, this.setMyValue);
  }

	// Add a connection
	connectToPin(connector, pinName)
	{
    if (pinName === 'In')
		{
			this.connectIn = connector;
			connector.set_location(this.x, this.y + 10);
			return;
		}
    if (pinName === 'Load')
		{
			this.connectLoad = connector;
			connector.set_location(this.x + 10, this.y + 50);
			return;
		}
		if (pinName === 'Out')
		{
			this.connectOut = connector;
			connector.set_location(this.x + 30, this.y + 10);
			return;
		}
		this.processor.add_error('A DPLatch gate does not have a pin named ' + pinName);
	}

	// This is run when the reset button is pressed.  If this latch has
	// powerOnReset, its value loads with 0 (otherwise it loads with 'Unknown')
	reset()
	{
		if (this.powerOnReset)
		{
			this.value = 0;
		}
		else
		{
			this.value = 'Unknown';
		}
	}

	// We don't do anything to begin the eval of a control.
	begin_eval()
	{
		// EMPTY
	}

	// Evaluate this gate.  This gate constantly sends out its stored value.
	eval()
	{
        // Only eval if this is connected.
        if (this.connectIn === null || this.connectOut === null)
        {
            return;
        }
        this.connectOut.set_value(this.value);
        if (this.connectLoad !== null)
        {
            let load = this.connectLoad.use_value();
            if (load === true)
            {
            this.connectIn.use_value();
            }
        }
	}

	// At the end of the evaluation (end of the clock cycle), we
  // load the data into the latch (if the control is HIGH)
	end_eval()
	{
        let load;
        if (this.connectLoad == null)
        {
            load = true;
        }
        else
        {
            load = this.connectLoad.use_value();
            if (load === 'Conflict' || load === 'Unknown')
            {
                this.value = 'Unknown';
                return;
            }
        }
        if (load === true)
        {
            this.value = this.handleIR(this.connectIn.use_value());
            return;
        }
	}

  // Build the implementation of the control (a MuxView component)
  implement()
  {
    return ( <LatchView
                x={this.x}
                y={this.y}
                key={this.key}
                value={this.value}
								value2={this.opcode}
								label={this.label}
								callback={this.handleClick}
              />);
  }
};

export default DPLatch;
