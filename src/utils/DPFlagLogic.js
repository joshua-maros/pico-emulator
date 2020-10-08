// src/utils/DPFlagLogic.js - The flag logic for the datapath view
import React from 'react';
import FlagLogicView from '../components/FlagLogicView';

class DPFlagLogic
{
	constructor(processor, id, key, x, y)
	{
    this.processor = processor;
		this.id = id;
    this.key = key;
    this.x = x;
    this.y = y;

		// We do not yet have the connections
    this.connectIn = null;
    this.connectOp = null;
		this.connectOut = null;

    // The flag bits.  The values are:
    // 0: false
    // 2: true
    // 1: unknown
    this.flagN = 1;
    this.flagZ = 1;
    this.flagC = 1;
    this.flagV = 1;
    this.flagTZ = 1;

		// For viewing:
		// These are a series of 5 2-bit values, giving the states of
		// each of the flags.
		this.inVal = 341;
		this.outVal = 341;
	};

	// Add a connection
	connectToPin(connector, pinName)
	{
    if (pinName === 'In')
		{
			this.connectIn = connector;
			connector.set_location(this.x + 30, this.y + 30);
			return;
		}
    if (pinName === 'Op')
		{
			this.connectOp = connector;
			connector.set_location(this.x, this.y + 15);
			return;
		}
		if (pinName === 'Out')
		{
			this.connectOut = connector;
			connector.set_location(this.x + 30, this.y);
			return;
		}
		this.processor.add_error('A DPFlagLogic gate does not have a pin named ' + pinName);
	}

	reset()
	{
		this.flagN = 1;
		this.flagZ = 1;
		this.flagC = 1;
		this.flagV = 1;
		this.flagTZ = 1;
		this.inVal = 341;
		this.outVal = 341;
	}

	// We don't do anything to begin the eval of a control.
	begin_eval()
	{
		// EMPTY
	}

	// Evaluate this gate:
	eval()
	{
    // This part evaluates the operations that read the flag values.
    // Only eval if this is connected.
    if (this.connectIn === null || this.connectOp === null
      || this.connectOut === null)
    {
      return;
    }

		// Process the input value, only to set inVal for the display.
		const input = this.connectIn.use_value();
		if (input === 'Conflict' || input === 'Unknown')
		{
			this.inVal = 341;
		}
		else
		{
			// Each bit of input becomes a '2' value of the output.
			this.inVal = ((input & 1) << 1)
				+ ((input & 2) << 2)
				+ ((input & 4) << 3)
				+ ((input & 8) << 4)
				+ ((input & 16) << 5);
		}

    const op = this.connectOp.use_value();
    if (op === 'Conflict' || op === 'Unknown' || op === 'none' || op === 0)
    {
      this.connectOut.set_value('Unknown');
      return;
    }
    let val = 1;
    switch (op)
    {
      case 'RDTZ':
        val = this.flagTZ;
        break;
      case 'RDC':
        val = this.flagC;
        break;
      case 'RDZ':
        val = this.flagZ;
        break;
      case 'RDN':
        val = this.flagN;
        break;
      case 'RDV':
        val = this.flagV;
        break;
      case 'RDNC':
        val = 2 - this.flagC;
        break;
      case 'RDNZ':
        val = 2 - this.flagZ;
        break;
      case 'RDNN':
        val = 2 - this.flagN;
        break;
      case 'RDNV':
        val = 2 - this.flagV;
        break;
      case 'ROT':
        val = this.flagC;
        break;
      case 'LDZ':
      case 'LDALL':
      case 'LDTZ':
      case 'CLC':
      case 'STC':
      case 'CMC':
        break;
      default:
        this.processor.add_error('Evaluating DPFlagLogic ' + this.id + ': Op input has unknown value ' + op);
        break;
    }
    switch (val)
    {
      default:
      case 1:
        this.connectOut.set_value('Unknown');
        return;
      case 0:
        this.connectOut.set_value(false);
        return;
      case 2:
        this.connectOut.set_value(true);
        return;
    }
	}

	// In this code, we capture the input flag values (as controlled by the op.)
	end_eval()
	{
    if (this.connectIn === null || this.connectOp === null
      || this.connectOut === null)
    {
      return;
    }
    const op = this.connectOp.get_value();
    if (op === 'Conflict' || op === 'Unknown')
    {
      this.connectOut.set_value('Unknown');
      return;
    }
    const inval = this.connectIn.get_value();
    switch (op)
    {
      case 'RDTZ':
      case 'RDC':
      case 'RDZ':
      case 'RDN':
      case 'RDV':
      case 'RDNC':
      case 'RDNZ':
      case 'RDNN':
      case 'RDNV':
        return;
      case 'ROT':
        if (inval === 'Conflict' || inval === 'Unknown')
        {
          this.flagC = 1;
        }
        else if ((inval & 2) !== 0)
        {
          this.flagC = 2;
        }
        else
        {
          this.flagC = 0;
        }
        break;
      case 'LDZ':
        if (inval === 'Conflict' || inval === 'Unknown')
        {
          this.flagZ = 1;
        }
        else if ((inval & 2) !== 0)
        {
          this.flagZ = 2;
        }
        else
        {
          this.flagZ = 0;
        }
        break;
      case 'LDALL':
        if (inval === 'Conflict' || inval === 'Unknown')
        {
          this.flagC = 1;
          this.flagZ = 1;
          this.flagN = 1;
          this.flagV = 1;
        }
        else
        {
          this.flagN = ((inval & 1) === 1) ? 2 : 0;
          this.flagZ = ((inval & 2) === 2) ? 2 : 0;
          this.flagC = ((inval & 4) === 4) ? 2 : 0;
          this.flagV = ((inval & 8) === 8) ? 2 : 0;
        }
        break;
      case 'LDTZ':
        if (inval === 'Conflict' || inval === 'Unknown')
        {
          this.flagZ = 1;
        }
        else if ((inval & 2) !== 0)
        {
          this.flagZ = 2;
        }
        else
        {
          this.flagZ = 0;
        }
        break;
      case 'CLC':
        this.flagC = 0;
        break;
      case 'STC':
        this.flagC = 2;
        break;
      case 'CMC':
        this.flagC = 2 - this.flagC;
        break;
      default:
        this.processor.add_error('Evaluating DPFlagLogic ' + this.id + ': Op input has unknown value ' + op);
        return;
    }
		this.outVal = (this.flagN) + (this.flagZ << 2) + (this.flagC << 4) +
			(this.flagV << 6) + (this.flagTZ << 8);
	}

  // Build the implementation of the control (a MuxView component)
  implement()
  {
    return ( <FlagLogicView
                x={this.x}
                y={this.y}
                key={this.key}
								inVal={this.inVal}
								outVal={this.outVal}
              />);
  }
};

export default DPFlagLogic;
