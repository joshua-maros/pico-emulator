// src/utils/DPALU.js - The ALU for the datapath view
import React from 'react';
import ALUView from '../components/ALUView';
import AsUnsignedNBits from './AsUnsignedNBits';
import AsNBits from './AsNBits';

class DPALU
{
	constructor(processor, id, key, x, y, nBits)
	{
    this.processor = processor;
		this.id = id;
    this.key = key;
    this.x = x;
    this.y = y;
    this.nBits = nBits;

		// We do not yet have the connections
    this.connectIn0 = null;
    this.connectIn1 = null;
    this.connectOp = null;
    this.connectOut = null;
    this.connectCin = null;
    this.connectFlags = null;
	};

	// Add a connection
	connectToPin(connector, pinName)
	{
    if (pinName === 'In0')
		{
			this.connectIn0 = connector;
			connector.set_location(this.x, this.y + 15);
			return;
		}
    if (pinName === 'In1')
		{
			this.connectIn1 = connector;
			connector.set_location(this.x, this.y + 65);
			return;
		}
    if (pinName === 'Op')
		{
			this.connectOp = connector;
			connector.set_location(this.x + 20, this.y + 70);
			return;
		}
		if (pinName === 'Out')
		{
			this.connectOut = connector;
			connector.set_location(this.x + 40, this.y + 40);
			return;
		}
    if (pinName === 'Flags')
		{
			this.connectFlags = connector;
			connector.set_location(this.x + 20, this.y + 10);
			return;
		}
    if (pinName === 'Cin')
		{
			this.connectCin = connector;
			connector.set_location(this.x + 30, this.y + 65);
			return;
		}
		this.processor.add_error('A DPALU gate does not have a pin named ' + pinName);
	}

	// We don't do anything to begin the eval of the ALU
	begin_eval()
	{
		// EMPTY
	}

  getIn0()
  {
    const in0 = AsUnsignedNBits(this.connectIn0.use_value(), this.nBits);
    if (in0 === 'Conflict' || in0 === 'Unknown')
    {
      this.connectOut.set_value('Unknown');
      if (this.connectFlags !== null)
      {
        this.connectFlags.set_value('Unknown');
      }
      return {in0:0, ok0:false};
    }
    return {in0:in0, ok0:true};
  }

  getIn1()
  {
    const in1 = AsUnsignedNBits(this.connectIn1.use_value(), this.nBits);
    if (in1 === 'Conflict' || in1 === 'Unknown')
    {
      this.connectOut.set_value('Unknown');
      if (this.connectFlags !== null)
      {
        this.connectFlags.set_value('Unknown');
      }
      return {in1:0, ok1:false};
    }
    return {in1:in1, ok1:true};
  }

  getCin(op)
  {
    if (this.connectCin === null)
    {
      this.processor.add_error('A DPALU gate cannot perform a ' + op + ' instruction without a Cin connection.');
      this.connectOut.set_value('Unknown');
      if (this.connectFlags !== null)
      {
        this.connectFlags.set_value('Unknown');
      }
      return {cin:false, okcin:false};
    }
    const cin = this.connectCin.use_value();
    if (cin === 'Conflict' || cin === 'Unknown')
    {
      this.connectOut.set_value('Unknown');
      if (this.connectFlags !== null)
      {
        this.connectFlags.set_value('Unknown');
      }
      return {cin:false, okcin:false};
    }
    return {cin:cin, okcin:true};
  }

  // We have performed the math on in0 and in1 to make result, but as
  // unsigned numbers.  Compute the flag values, and convert result to
  // a signed number, setting the output connections.
  finishUp(result, in0, in1)
  {
    let flags = 0;
    let carryBit = 1 << this.nBits;
    if ((result & carryBit) === carryBit)
    {
      flags += 4; // C flag
      result -= carryBit;
    }
    let signBit = carryBit >> 1;
    let ovf = 0;
    if ((result & signBit) === signBit)
    {
      flags += 1; // N flag
      ovf += 1;
    }
    if ((in0 & signBit) === signBit)
    {
      ovf += 4;
    }
    if ((in1 & signBit) === signBit)
    {
      ovf += 2;
    }
    if (ovf === 1 || ovf === 6)
    {
      flags += 8; // V flag
    }
    if (result === 0)
    {
      flags += 2; // Z flag
    }

    // By converting result back to a signed number, we sign extend it.
    this.connectOut.set_value(AsNBits(result, this.nBits));
    if (this.connectFlags !== null)
    {
      this.connectFlags.set_value(flags);
    }
  }

  doADD()
  {
    const {in0, ok0} = this.getIn0();
    if (ok0)
    {
      const {in1, ok1} = this.getIn1();
      if (ok1)
      {
        let result = in0 + in1;
        this.finishUp(result, in0, in1);
      }
    }
  }

  doSUB()
  {
    const {in0, ok0} = this.getIn0();
    if (ok0)
    {
      const {in1, ok1} = this.getIn1();
      if (ok1)
      {
        // We will negate B (by complimenting and incrementing it),
        // then add the two numbers.
        const negin1 = AsUnsignedNBits((~in1) + 1, this.nBits);
        let result = in0 + negin1;
        this.finishUp(result, in0, negin1);
      }
    }
  }

  doAND()
  {
    const {in0, ok0} = this.getIn0();
    if (ok0)
    {
      const {in1, ok1} = this.getIn1();
      if (ok1)
      {
        let result = in0 & in1;
        this.finishUp(result, in0, in1);
      }
    }
  }

  doOR()
  {
    const {in0, ok0} = this.getIn0();
    if (ok0)
    {
      const {in1, ok1} = this.getIn1();
      if (ok1)
      {
        let result = in0 | in1;
        this.finishUp(result, in0, in1);
      }
    }
  }

  doXOR()
  {
    const {in0, ok0} = this.getIn0();
    if (ok0)
    {
      const {in1, ok1} = this.getIn1();
      if (ok1)
      {
        let result = in0 ^ in1;
        this.finishUp(result, in0, in1);
      }
    }
  }

  doINC()
  {
    const {in0, ok0} = this.getIn0();
    if (ok0)
    {
      let result = in0 + 1;
      this.finishUp(result, in0, 1);
    }
  }

  doINCB()
  {
    const {in1, ok1} = this.getIn1();
    if (ok1)
    {
      let result = in1 + 1;
      this.finishUp(result, in1, 1);
    }
  }

  doDEC()
  {
    const {in0, ok0} = this.getIn0();
    if (ok0)
    {
      let in1 = AsUnsignedNBits(-1, this.nBits);
      let result = in0 + in1;
      this.finishUp(result, in0, in1);
    }
  }

  doCMA()
  {
    const {in0, ok0} = this.getIn0();
    if (ok0)
    {
      let result = AsUnsignedNBits(~in0, this.nBits);
      this.finishUp(result, in0, 0);
    }
  }

  doNEG()
  {
    const {in0, ok0} = this.getIn0();
    if (ok0)
    {
      let result = AsUnsignedNBits((~in0) + 1, this.nBits);
      this.finishUp(result, in0, 0);
    }
  }

  doRAL()
  {
    const {in0, ok0} = this.getIn0();
    if (ok0)
    {
      const {cin, okcin} = this.getCin('RAL');
      if (okcin)
      {
        let result = (in0 << 1) + (cin ? 1 : 0);
        this.finishUp(result, in0, 0);
      }
    }
  }

  doRAR()
  {
    const {in0, ok0} = this.getIn0();
    if (ok0)
    {
      const {cin, okcin} = this.getCin('RAR');
      if (okcin)
      {
        let carryBit = 1 << this.nBits;
        let tmp = in0 & 1;
        let result = in0;
        if (cin)
        {
          result += carryBit;
        }
        result = result >> 1;
        if (tmp !== 0)
        {
          result |= carryBit;
        }
        this.finishUp(result, in0, 0);
      }
    }
  }

  doZERO()
  {
    this.connectOut.set_value(0);
    if (this.connectFlags !== null)
    {
      this.connectFlags.set_value(2); // Z flag
    }
  }

  doONES()
  {
    this.connectOut.set_value(-1);
    if (this.connectFlags !== null)
    {
      this.connectFlags.set_value(1); // N flag
    }
  }

	// Evaluate this gate:
	eval()
	{
    // This part evaluates the operations that read the flag values.
    // Only eval if this is connected.  However, cin and flags are optional.
    if (this.connectIn0 === null || this.connectIn1 === null
      || this.connectOp === null || this.connectOut === null)
    {
      return;
    }
    const op = this.connectOp.get_value();
    if (op === 'Conflict' || op === 'Unknown' || op === 'none')
    {
      this.connectOut.set_value('Unknown');
      if (this.connectFlags !== null)
      {
        this.connectFlags.set_value('Unknown');
      }
      return;
    }
    switch (op)
    {
      case 'ADD':
        this.doADD();
        break;
      case 'AND':
        this.doAND();
        break;
      case 'INC':
        this.doINC();
        break;
      case 'DEC':
        this.doDEC();
        break;
      case 'ZERO':
        this.doZERO();
        break;
      case 'INCB':
        this.doINCB();
        break;
      case 'RAL':
        this.doRAL();
        break;
      case 'RAR':
        this.doRAR();
        break;
      case 'CMA':
        this.doCMA();
        break;
      case 'NEG':
        this.doNEG();
        break;
      case 'ONES':
        this.doONES();
        break;
      case 'SUB':
        this.doSUB();
        break;
      case 'OR':
        this.doOR();
        break;
      case 'XOR':
        this.doXOR();
        break;
      default:
        this.processor.add_error('Evaluating DPALU ' + this.id + ': Op input has unknown value ' + op);
        break;
    }
	}

	// In this code, we don't do anything
	end_eval()
	{
    // EMPTY
	}

  // Build the implementation of the control (a MuxView component)
  implement()
  {
    return ( <ALUView
                x={this.x}
                y={this.y}
                key={this.key}
              />);
  }
};

export default DPALU;
