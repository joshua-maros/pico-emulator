import React from 'react';
import { Input, LogicComponent, Output } from "./component";
import { Datapath } from './datapath';

export class Tristate extends LogicComponent
{
  // The names of the fields need to match the names given to the constructor.
  public in: Input;
  public enable = new Input('enable', 15, 30);
  public out: Output;
  public readonly flip: boolean;

  constructor(id: string, x: number, y: number, params: any)
  {
    super("Tristate", id, x, y);
    let f = params.flip === true;
    this.flip = f;
    this.in = new Input('in', f ? 30 : 0, 20);
    this.out = new Output('out', f ? 0 : 30, 20);
  }

  public eval()
  {
    if (this.enable.asBoolean === true)
    {
      let value = this.in.value;
      if (value !== undefined)
      {
        this.out.value = value;
        return;
      }
    }
    this.out.clear();
  }

  public render(k: string, d: Datapath)
  {
    return (<TristateView key={k} c={this} d={d} />)
  }
}

class TristateView extends React.Component<{ c: Tristate, d: Datapath }>
{
  render()
  {
    const { x, y, flip } = this.props.c;
    const xfrm = 'translate(' + x + ',' + y + ')';
    const x0 = flip ? 30 : 0;
    const x1 = 30 - x0;
    return (
      <g transform={xfrm} className="component">
        <line key={3} x1={x0} y1={0} x2={x0} y2={40} />
        <line key={4} x1={x0} y1={0} x2={x1} y2={20} />
        <line key={5} x1={x0} y1={40} x2={x1} y2={20} />
      </g>);
  }
};
