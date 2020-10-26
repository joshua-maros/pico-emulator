import React from 'react';
import { MemoryCell } from '../utils/memory_cells';
import { fromSignedBits } from '../utils/util';
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
  public data: MemoryCell;

  constructor(d: Datapath, id: string, x: number, y: number, params: any)
  {
    super(d, "Latch", id, x, y);
    this.name = params.name || "Unnamed";
    this.data = new MemoryCell(this.name);
    this.resetValue = params.resetValue;
    if (this.resetValue !== undefined)
    {
      this.resetValue = '' + this.resetValue;
    }
    this.nbits = params.nbits;
    if (params.visible === true)
    {
      d.visibleRegisters.push(this.data);
    }
  }

  public eval()
  {
    this.out.value = this.data.value;
    this.in.used = this.load.asBoolean === true;
    this.load.used = this.load.asBoolean === true;
  }

  public evalClock()
  {
    this.data.clearLastUse();
    if (this.load.asBoolean === true)
    {
      if (this.nbits === undefined)
      {
        this.data.value = this.in.value;
      }
      else
      {
        let value = this.in.asInteger;
        if (value !== undefined)
        {
          value = fromSignedBits(value, this.nbits);
          this.data.value = '' + value;
        }
        else
        {
          this.data.value = undefined;
        }
      }
      this.data.lastUse = 'write';
    }
    else if (this.data.value !== undefined && this.out.used)
    {
      this.data.lastUse = 'read';
    }
  }

  public reset()
  {
    this.data.value = this.resetValue;
    this.data.clearLastUse();
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
    const value = this.props.c.data.value;
    const fval = value === undefined ? '?' : value;
    return (
      <g transform={xfrm} className="component">
        <rect x={0} y={0} width={30} height={50} className={this.props.c.data.lastUseCssClass} />
        <text className="label" x={15} y={23} textAnchor="middle">{label}</text>
        <text className="value" x={0} y={-2}>{fval}</text>
      </g>);
  }
};
