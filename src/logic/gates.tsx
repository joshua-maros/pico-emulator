import React from 'react';
import { Input, LogicComponent, Output } from "./component";
import { Datapath } from './datapath';

export class And extends LogicComponent
{
  // The names of the fields need to match the names given to the constructor.
  public in0 = new Input('in0', 0, 5);
  public in1 = new Input('in1', 0, 15);
  public out = new Output('out', 20, 10);

  constructor(id: string, x: number, y: number, _params: any)
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

  public render(k: string, d: Datapath)
  {
    return (<AndView key={k} c={this} d={d} />)
  }
}

class AndView extends React.Component<{ c: And, d: Datapath }>
{
  render()
  {
    const { x, y } = this.props.c;
    const xfrm = `translate(${x}, ${y})`;
    return (
      <g transform={xfrm} className="component">
        <path d='M0 0 H10 A10 10 0 0 1 10 20 H 0 Z' />
      </g>);
  }
};

export class Or extends LogicComponent
{
  // The names of the fields need to match the names given to the constructor.
  public in0 = new Input('in0', 0, 5);
  public in1 = new Input('in1', 0, 15);
  public out = new Output('out', 20, 10);

  constructor(id: string, x: number, y: number, _params: any)
  {
    super("Or", id, x, y);
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
      this.out.asBoolean = a || b;
    }
  }

  public render(k: string, d: Datapath)
  {
    return (<OrView key={k} c={this} d={d} />)
  }
}

class OrView extends React.Component<{ c: Or, d: Datapath }>
{
  render()
  {
    const { x, y } = this.props.c;
    const xfrm = `translate(${x}, ${y})`;
    return (
      <g transform={xfrm} className="component">
        <path d='M-3.7 0 A33 33 0 0 1 20 10 A33 33 0 0 1 -3.7 20 A13 13 0 0 0 -3.7 0 Z' />
      </g>);
  }
};

export class AndOr extends LogicComponent
{
  // The names of the fields need to match the names given to the constructor.
  public in0 = new Input('in0', 20, 5);
  public in1 = new Input('in1', 0, 15);
  public in2 = new Input('in2', 0, 25);
  public out = new Output('out', 40, 10);

  constructor(id: string, x: number, y: number, _params: any)
  {
    super("AndOr", id, x, y);
  }

  public eval()
  {
    const a = this.in0.asBoolean, b = this.in1.asBoolean, c = this.in2.asBoolean;
    if ((a === true) || ((b === true) && (c === true)))
    {
      this.out.asBoolean = true;
    }
    else if (a === undefined || b === undefined || c === undefined)
    {
      this.out.clear();
    }
    else
    {
      this.out.asBoolean = false;
    }
  }

  public render(k: string, d: Datapath)
  {
    return (<AndOrView key={k} c={this} d={d} />)
  }
}

class AndOrView extends React.Component<{ c: AndOr, d: Datapath }>
{
  render()
  {
    const { x, y } = this.props.c;
    const xfrm = `translate(${x}, ${y})`;
    return (
      <g transform={xfrm} className="component">
        <path d='M16.3 0 A33 33 0 0 1 40 10 A33 33 0 0 1 16.3 20 A13 13 0 0 0 16.3 0 Z' />
        <path d='M0 10 H10 A10 10 0 0 1 10 30 H 0 Z' />
      </g>);
  }
};



