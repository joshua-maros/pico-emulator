import React from 'react';
import { asUnsignedBits, fromSignedBits } from '../utils/util';
import { Input, LogicComponent, Output } from "./component";
import { Datapath } from './datapath';

export class ALU extends LogicComponent
{
  // The names of the fields need to match the names given to the constructor.
  public in0 = new Input('in0', 0, 15);
  public in1 = new Input('in0', 0, 65);
  public op = new Input('op', 20, 70);
  public cin = new Input('cin', 30, 65);
  public out = new Output('out', 40, 40);
  public flags = new Output('flags', 20, 10);
  private readonly nBits: number;

  constructor(d: Datapath, id: string, x: number, y: number, params: any)
  {
    super(d, "ALU", id, x, y);
    this.nBits = params.nbits;
  }

  // We have performed the math on in0 and in1 to make result, but as
  // unsigned numbers.  Compute the flag values, and convert result to
  // a signed number, setting the output connections.
  finishUp(result: number, in0: number, in1: number)
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
    this.out.asInteger = fromSignedBits(result, this.nBits);
    this.flags.asInteger = flags;
  }

  doADD()
  {
    const in0 = this.in0.asInteger, in1 = this.in1.asInteger;
    if (in0 !== undefined && in1 !== undefined)
    {
      let result = in0 + in1;
      this.finishUp(result, in0, in1);
    }
  }

  doSUB()
  {
    const in0 = this.in0.asInteger, in1 = this.in1.asInteger;
    if (in0 !== undefined && in1 !== undefined)
    {
      // We will negate B (by complimenting and incrementing it),
      // then add the two numbers.
      const negin1 = asUnsignedBits((~in1) + 1, this.nBits);
      let result = in0 + negin1;
      this.finishUp(result, in0, negin1);
    }
  }

  doAND()
  {
    const in0 = this.in0.asInteger, in1 = this.in1.asInteger;
    if (in0 !== undefined && in1 !== undefined)
    {
      let result = in0 & in1;
      this.finishUp(result, in0, in1);
    }
  }

  doOR()
  {
    const in0 = this.in0.asInteger, in1 = this.in1.asInteger;
    if (in0 !== undefined && in1 !== undefined)
    {
      let result = in0 | in1;
      this.finishUp(result, in0, in1);
    }
  }

  doXOR()
  {
    const in0 = this.in0.asInteger, in1 = this.in1.asInteger;
    if (in0 !== undefined && in1 !== undefined)
    {
      let result = in0 ^ in1;
      this.finishUp(result, in0, in1);
    }
  }

  doINC()
  {
    const in0 = this.in0.asInteger;
    if (in0 !== undefined)
    {
      let result = in0 + 1;
      this.finishUp(result, in0, 1);
    }
  }

  doINCB()
  {
    const in1 = this.in1.asInteger;
    if (in1 !== undefined)
    {
      let result = in1 + 1;
      this.finishUp(result, 1, in1);
    }
  }

  doDEC()
  {
    const in0 = this.in0.asInteger;
    if (in0 !== undefined)
    {
      let in1 = asUnsignedBits(-1, this.nBits);
      let result = in0 + in1;
      this.finishUp(result, in0, in1);
    }
  }

  doDECB()
  {
    const in1 = this.in1.asInteger;
    if (in1 !== undefined)
    {
      let in0 = asUnsignedBits(-1, this.nBits);
      let result = in0 + in1;
      this.finishUp(result, in0, in1);
    }
  }

  doCMA()
  {
    const in0 = this.in0.asInteger;
    if (in0 !== undefined)
    {
      let result = asUnsignedBits(~in0, this.nBits);
      this.finishUp(result, in0, 0);
    }
  }

  doNEG()
  {
    const in0 = this.in0.asInteger;
    if (in0 !== undefined)
    {
      let result = asUnsignedBits((~in0) + 1, this.nBits);
      this.finishUp(result, in0, 0);
    }
  }

  doRAL()
  {
    const in0 = this.in0.asInteger, cin = this.cin.asBoolean;
    if (in0 !== undefined && cin !== undefined)
    {
      let result = (in0 << 1) + (cin ? 1 : 0);
      this.finishUp(result, in0, 0);
    }
  }

  doRAR()
  {
    const in0 = this.in0.asInteger, cin = this.cin.asBoolean;
    if (in0 !== undefined && cin !== undefined)
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

  doZERO()
  {
    this.out.asInteger = 0;
    this.flags.asInteger = 2 // Z flag
  }

  doONES()
  {
    this.out.asInteger = -1;
    this.flags.asInteger = 1; // N flag
  }

  public eval()
  {
    // If any of the opcode-specific fns exit early, we will be left with this.
    this.out.clear();
    this.flags.clear();
    let op = this.op.value;
    if (op === undefined)
    {
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
      case 'INCB':
        this.doINCB();
        break;
      case 'DEC':
        this.doDEC();
        break;
      case 'DECB':
        this.doDECB();
        break;
      case 'ZERO':
        this.doZERO();
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
        throw new Error('Evaluating ALU ' + this.id + ': Op input has unknown value ' + op);
    }
  }

  public render(k: string, d: Datapath)
  {
    return (<ALUView key={k} c={this} d={d} />)
  }
}

class ALUView extends React.Component<{ c: ALU, d: Datapath }>
{
  render()
  {
    const { x, y } = this.props.c;
    const xfrm = 'translate(' + x + ',' + y + ')';
    return (
      <g transform={xfrm} className="component">
        <path d='M0 0 L40 20 V60 L0 80 V50 L20 40 L0 30 Z' />
      </g>);
  }
};
