import React from 'react';
import { FlagCell } from '../utils/memory_cells';
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
  public flagN = new FlagCell('NEG');
  public flagZ = new FlagCell('ZERO');
  public flagC = new FlagCell('CARRY');
  public flagV = new FlagCell('V');
  public flagTZ = new FlagCell('TZ');

  constructor(d: Datapath, id: string, x: number, y: number, params: any)
  {
    super(d, "FlagLogic", id, x, y);
    d.visibleFlags.push(this.flagC);
    d.visibleFlags.push(this.flagZ);
    d.visibleFlags.push(this.flagN);
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
        val = this.flagTZ.value;
        break;
      case 'RDC':
        val = this.flagC.value;
        break;
      case 'RDZ':
        val = this.flagZ.value;
        break;
      case 'RDN':
        val = this.flagN.value;
        break;
      case 'RDV':
        val = this.flagV.value;
        break;
      case 'RDNC':
        val = maybeNot(this.flagC.value);
        break;
      case 'RDNZ':
        val = maybeNot(this.flagZ.value);
        break;
      case 'RDNN':
        val = maybeNot(this.flagN.value);
        break;
      case 'RDNV':
        val = maybeNot(this.flagV.value);
        break;
      case 'ROT':
        val = this.flagC.value;
        this.in.used = true;
        break;
      case 'LDZ':
      case 'LDALL':
      case 'LDTZ':
      case 'CLC':
      case 'STC':
      case 'CMC':
        this.in.used = true;
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
        this.flagC.value = maybeBit(inval, 1);
        break;
      case 'LDZ':
        this.flagZ.value = maybeBit(inval, 1);
        break;
      case 'LDALL':
        this.flagN.value = maybeBit(inval, 0);
        this.flagZ.value = maybeBit(inval, 1);
        this.flagC.value = maybeBit(inval, 2);
        this.flagV.value = maybeBit(inval, 3);
        break;
      case 'LDTZ':
        this.flagZ.value = maybeBit(inval, 1);
        break;    
      case 'CLC': 
        this.flagC.value = false;
        break;    
      case 'STC': 
        this.flagC.value = true;
        break;    
      case 'CMC': 
        this.flagC.value = maybeNot(this.flagC.value);
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
    const outStr = bitName(c.flagTZ.value)
      + ' ' + bitName(c.flagV.value)     
      + ' ' + bitName(c.flagC.value)     
      + ' ' + bitName(c.flagZ.value)     
      + ' ' + bitName(c.flagN.value);
    return (
      <g transform={xfrm} className="component">
        <path d='M0 0 H 60 V 30 H 0 Z' />
        <text className="small-label" x={30} y={10} textAnchor="middle"  >{outStr}</text>
        <text className="small-label" x={30} y={19} textAnchor="middle" >T V C Z N</text>
        <text className="small-label" x={30} y={28} textAnchor="middle" >{inStr}</text>
      </g>);
  }
};
