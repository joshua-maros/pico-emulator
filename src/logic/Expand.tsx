import React from 'react';
import { asUnsignedBits } from '../utils/util';
import { Input, LogicComponent, Output } from "./component";
import { Datapath } from './datapath';

export class Expand extends LogicComponent
{
  // The names of the fields need to match the names given to the constructor.
  public in = new Input('in', 0, 25);
  public out = new Output('out', 20, 25);
  public readonly inNBits: number;
  public readonly outNBits: number;
  public readonly extend: boolean;

  constructor(d: Datapath, id: string, x: number, y: number, params: any)
  {
    super(d, "Expand", id, x, y);
    this.inNBits = params.inNBits;
    this.outNBits = params.outNBits;
    this.extend = params.extend === true;
  }

  public eval()
  {
    let value = this.in.asInteger;
    if (value === undefined)
    {
      this.out.clear();
      return;
    }
    value = asUnsignedBits(value, this.inNBits);
    let outValue = asUnsignedBits(value, this.outNBits);
    if (this.outNBits > this.inNBits && this.extend)
    {
      // We need to sign-extend the number.
      const signBit = 1 << (this.inNBits - 1);
      if ((value & signBit) !== 0)
      {
        let bits = (1 << this.outNBits) - (1 << this.inNBits);
        outValue |= bits;
      }
    }
    this.out.asInteger = outValue;
    this.in.used = this.out.used;
  }

  public render(k: string, d: Datapath)
  {
    return (<ExpandView key={k} c={this} d={d} />)
  }
}

class ExpandView extends React.Component<{ c: Expand, d: Datapath }>
{
  render()
  {
    const { x, y } = this.props.c;
    const xfrm = 'translate(' + x + ',' + y + ')';
    return (
      <g transform={xfrm} className="component">
        <line key={3} x1={0} y1={10} x2={0} y2={40} />
        <line key={4} x1={0} y1={10} x2={20} y2={0} />
        <line key={5} x1={0} y1={40} x2={20} y2={50} />
        <line key={6} x1={20} y1={0} x2={20} y2={50} />
      </g>);
  }
};
