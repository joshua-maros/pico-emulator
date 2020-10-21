import React from 'react';
import { Input, LogicComponent, Output } from "./component";

export class And extends LogicComponent
{
  // The names of the fields need to match the names given to the constructor.
  public in0 = new Input('in0', 0, 0);
  public in1 = new Input('in1', 0, 0);
  public out = new Output('out', 0, 0);

  constructor(id: string, x: number, y: number)
  {
    super("And", id, x, y);
  }

  public eval()
  {
    const a = this.in0.asBoolean, b = this.in1.asBoolean;
    if (a === undefined || b === undefined)
    {
      this.out.clear();
    }
    else
    {
      this.out.asBoolean = a && b;
    }
  }

  public render()
  {
    return (<AndView c={this}/>)
  }
}

class AndView extends React.Component<{ c: And }>
{
  render()
  {
    const { x, y } = this.props.c;
    const xfrm = 'translate(' + x + ',' + y + ')';
    return (
      <g transform={xfrm} className="component">
        <path d='M0 0 H10 A10 10 0 0 1 10 20 H 0 Z' />
      </g>);
  }
};
