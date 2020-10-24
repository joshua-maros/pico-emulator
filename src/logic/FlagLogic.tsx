import React from 'react';
import { Input, LogicComponent, Output } from "./component";
import { Datapath } from './datapath';

function maybeNot(val: boolean | undefined): boolean | undefined 
{
  if (val === undefined)
  {
    return val;
  }
  else
  {
    return !val;
  }
}

function maybeBit(val: number | undefined, bit: number): boolean | undefined
{
  if (val === undefined)
  {
    return undefined;
  }
  else
  {
    return (val & (0b1 << bit)) > 0;
  }
}

function bitName(val: boolean | undefined): string
{
  if (val === undefined)
  {
    return "?";
  }
  else if (val === true)
  {
    return "T";
  }
  else
  {
    return "F";
  }
}

export class FlagLogic extends LogicComponent
{
  // The names of the fields need to match the names given to the constructor.
  public in = new Input('in', 30, 30);
  public op = new Input('op', 0, 15);
  public out = new Output('out', 30, 0);
  public flagN: boolean | undefined = undefined;
  public flagZ: boolean | undefined = undefined;
  public flagC: boolean | undefined = undefined;
  public flagV: boolean | undefined = undefined;
  public flagTZ: boolean | undefined = undefined;

  constructor(id: string, x: number, y: number, params: any)
  {
    super("FlagLogic", id, x, y);
  }

  public eval()
  {
    this.out.clear();
    const op = this.op.value;
    if (op === undefined)
    {
      return;
    }
    let val: boolean | undefined = undefined;
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
        val = maybeNot(this.flagC);
        break;
      case 'RDNZ':
        val = maybeNot(this.flagZ);
        break;
      case 'RDNN':
        val = maybeNot(this.flagN);
        break;
      case 'RDNV':
        val = maybeNot(this.flagV);
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
        throw new Error('Evaluating DPFlagLogic ' + this.id + ': Op input has unknown value ' + op);
    }
    this.out.asBoolean = val;
  }

  // In this code, we capture the input flag values (as controlled by the op.)
  public evalClock()
  {
    const op = this.op.value;
    if (op === undefined)
    {
      return;
    }
    const inval = this.in.asInteger;
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
        this.flagC = maybeBit(inval, 1);
        break;
      case 'LDZ':
        this.flagZ = maybeBit(inval, 1);
        break;
      case 'LDALL':
        this.flagN = maybeBit(inval, 0);
        this.flagZ = maybeBit(inval, 1);
        this.flagC = maybeBit(inval, 2);
        this.flagV = maybeBit(inval, 3);
        break;
      case 'LDTZ':
        this.flagZ = maybeBit(inval, 1);
        break;
      case 'CLC':
        this.flagC = false;
        break;
      case 'STC':
        this.flagC = true;
        break;
      case 'CMC':
        this.flagC = maybeNot(this.flagC);
        break;
      default:
        throw new Error('Evaluating DPFlagLogic ' + this.id + ': Op input has unknown value ' + op);
    }
  }

  public render(k: string, d: Datapath)
  {
    return (<FlagLogicView key={k} c={this} d={d} />)
  }
}

class FlagLogicView extends React.Component<{ c: FlagLogic, d: Datapath }>
{
  render()
  {
    const { x, y } = this.props.c;
    const xfrm = 'translate(' + x + ',' + y + ')';
    let c = this.props.c;
    const i = this.props.c.in.asInteger;
    const inStr = bitName(maybeBit(i, 4))
      + ' ' + bitName(maybeBit(i, 3))
      + ' ' + bitName(maybeBit(i, 2))
      + ' ' + bitName(maybeBit(i, 1))
      + ' ' + bitName(maybeBit(i, 0));
    const outStr = bitName(c.flagTZ)
      + ' ' + bitName(c.flagV)
      + ' ' + bitName(c.flagC)
      + ' ' + bitName(c.flagZ)
      + ' ' + bitName(c.flagN);
    return (
      <g transform={xfrm} className="component">
        <path d='M0 0 H 60 V 30 H 0 Z' />
        <text className="flag-label" x={30} y={10} textAnchor="middle"  >{outStr}</text>
        <text className="flag-label" x={30} y={19} textAnchor="middle" >T V C Z N</text>
        <text className="flag-label" x={30} y={28} textAnchor="middle" >{inStr}</text>
      </g>);
  }
};
