import React from 'react';
import { asUnsignedBits } from '../utils/util';
import { Input, LogicComponent, Output } from "./component";
import { Datapath } from './datapath';

export class Latch extends LogicComponent
{
  // The names of the fields need to match the names given to the constructor.
  public in = new Input('in', 0, 10);
  public load = new Input('load', 10, 50);
  public out = new Output('out', 30, 10);
  public readonly name: string;
  public readonly resetValue: string | undefined;
  public readonly nbits: number | undefined;
  public value: string | undefined = undefined;

  constructor(id: string, x: number, y: number, params: any)
  {
    super("Latch", id, x, y);
    this.name = params.name || "Unnamed";
    this.resetValue = params.resetValue;
    if (this.resetValue !== undefined)
    {
      this.resetValue = '' + this.resetValue;
    }
    this.nbits = params.nbits;
  }

  public eval()
  {
    this.out.value = this.value;
  }

  public evalClock()
  {
    if (this.load.asBoolean === true)
    {
      if (this.nbits === undefined)
      {
        this.value = this.in.value;
      }
      else
      {
        let value = this.in.asInteger;
        if (value !== undefined)
        {
          value = asUnsignedBits(value, this.nbits);
        }
        this.value = '' + value;
      }
    }
  }

  public reset()
  {
    this.value = this.resetValue;
  }

  public render(k: string, d: Datapath)
  {
    return (<LatchView key={k} c={this} d={d} />)
  }
}

class LatchView extends React.Component<{ c: Latch, d: Datapath }>
{
  render()
  {
    const { x, y } = this.props.c;
    const xfrm = 'translate(' + x + ',' + y + ')';
    const label = this.props.c.name;
    const value = this.props.c.value || '?';
    return (
      <g transform={xfrm} className="component">
        <rect x={0} y={0} width={30} height={50} />
        <text className="label" x={15} y={23} textAnchor="middle">{label}</text>
        <text className="value" x={33} y={7}>{value}</text>
      </g>);
  }
};
