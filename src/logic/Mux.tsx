import React from 'react';
import { Input, LogicComponent, Output } from "./component";
import { Datapath } from './datapath';

export class Mux extends LogicComponent
{
  // The names of the fields need to match the names given to the constructor.
  public in0 = new Input('in0', 0, 10);
  public in1 = new Input('in1', 0, 40);
  public sel = new Input('sel', 10, 45);
  public out = new Output('out', 20, 25);
  public readonly inNBits: number;
  public readonly outNBits: number;
  public readonly extend: boolean;

  constructor(id: string, x: number, y: number, params: any)
  {
    super("Mux", id, x, y);
    this.inNBits = params.inNBits;
    this.outNBits = params.outNBits;
    this.extend = params.extend === true;
  }

  public eval()
  {
    const sel = this.sel.asBoolean;
    if (sel === undefined)
    {
      this.out.clear();
      return;
    }
    if (sel)
    {
      this.out.value = this.in1.value;
    }
    else
    {
      this.out.value = this.in0.value;
    }
  }

  public render(k: string, d: Datapath)
  {
    return (<MuxView key={k} c={this} d={d} />)
  }
}

class MuxView extends React.Component<{ c: Mux, d: Datapath }>
{
  render()
  {
    const { x, y } = this.props.c;
    const xfrm = 'translate(' + x + ',' + y + ')';
    return (
      <g transform={xfrm} className="component">
        <text key={1} x={3} y={20} className="label">0</text>
        <text key={2} x={3} y={42} className="label">1</text>
        <line key={3} x1={0} y1={0} x2={0} y2={50} />
        <line key={4} x1={0} y1={0} x2={20} y2={10} />
        <line key={5} x1={0} y1={50} x2={20} y2={40} />
        <line key={6} x1={20} y1={10} x2={20} y2={40} />
      </g>);
  }
};
