import React from 'react';
import { asUnsignedBits } from '../utils/util';
import { Input, LogicComponent, Output } from "./component";
import { Datapath } from './datapath';

export class Incrementer extends LogicComponent
{
  // The names of the fields need to match the names given to the constructor.
  public in = new Input('in', 0, 15);
  public out = new Output('out', 30, 15);
  public readonly nbits: number;
  public readonly constant: number;

  constructor(d: Datapath, id: string, x: number, y: number, params: any)
  {
    super(d, "Incrementer", id, x, y);
    this.nbits = params.nbits;
    this.constant = params.constant;
  }

  public eval()
  {
    let value = this.in.asInteger;
    if (value === undefined)
    {
      this.out.clear();
      return;
    }
    value = asUnsignedBits(value, this.nbits) + this.constant;
    this.out.asInteger = asUnsignedBits(value, this.nbits);
    this.in.used = this.out.used;
  }

  public render(k: string, d: Datapath)
  {
    return (<IncrementerView key={k} c={this} d={d} />)
  }
}

class IncrementerView extends React.Component<{ c: Incrementer, d: Datapath }>
{
  render()
  {
    const { x, y } = this.props.c;
    const xfrm = 'translate(' + x + ',' + y + ')';
    const constant = this.props.c.constant;
    const label = ((constant >= 0) ? '+' : '') + constant;
    const value = this.props.c.out.asUserText;
    return (
      <g transform={xfrm} className="component">
        <circle cx={15} cy={15} r={15} />
        <text x={15} y={20} textAnchor="middle" className="label">{label}</text>
        <text x={33} y={12} className="value">{value}</text>
      </g>);
  }
};
