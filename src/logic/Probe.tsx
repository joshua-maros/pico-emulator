import React from 'react';
import { Input, LogicComponent, Output } from "./component";
import { Datapath } from './datapath';

export class Probe extends LogicComponent
{
  // The names of the fields need to match the names given to the constructor.
  public in = new Input('in', 0, 10);
  public readonly width: number;

  constructor(id: string, x: number, y: number, params: any)
  {
    super("Probe", id, x, y);
    this.width = params.wid || 70;
  }

  public render(k: string, d: Datapath)
  {
    return (<ProbeView key={k} c={this} d={d} />)
  }
}

class ProbeView extends React.Component<{ c: Probe, d: Datapath }>
{
  render()
  {
    const { x, y, in: input, width } = this.props.c;
    const xfrm = 'translate(' + x + ',' + y + ')';
    const value = input.value || '?';
    return (
      <g transform={xfrm} className="component">
        <text key={1} className="label" x={15} y={15}>{value}</text>
        <line key={3} x1={10} y1={0} x2={width} y2={0} />
        <line key={4} x1={10} y1={20} x2={width} y2={20} />
        <line key={5} x1={width} y1={0} x2={width} y2={20} />
        <line key={6} x1={0} y1={10} x2={10} y2={0} />
        <line key={7} x1={0} y1={10} x2={10} y2={20} />
      </g>);
  }
};
