import React from 'react';
import { Input, LogicComponent, Output } from "./component";
import { Datapath } from './datapath';

export class Control extends LogicComponent
{
  // The names of the fields need to match the names given to the constructor.
  public out: Output;
  // Values that this control can be. If undefined, then this is a simple 
  // true/false control.
  #options: Array<string> | undefined;
  readonly width: number = 60;
  readonly height: number = 20;
  // 0,1 for bool control, 0-len for option control.
  #value: number = 0;
  public readonly name: string;
  public readonly top: boolean;

  constructor(
    id: string,
    x: number,
    y: number,
    params: any,
    )
  {
    super("Control", id, x, y);

    let top = params.top !== false;
    this.top = top;
    let name: string = params.name || 'Unnamed';
    this.name = name;
    let options = params.options;
    this.#options = options;

    if (this.#options !== undefined)
    {
      this.#options.splice(0, 0, 'none');
    }
    if (top)
    {
      this.out = new Output('out', this.width / 2, 0);
    }
    else
    {
      this.out = new Output('out', this.width, this.height / 2);
    }
  }

  public eval()
  {
    if (this.#options === undefined)
    {
      // Boolean control.
      this.out.asBoolean = this.#value === 1;
    }
    else
    {
      // Option control.
      if (this.#value === 0)
      {
        this.out.clear();
      }
      else
      {
        this.out.value = this.#options[this.#value];
      }
    }
  }

  get label()
  {
    if (this.#options === undefined)
    {
      return this.name;
    }
    else
    {
      return this.#options[this.#value];
    }
  }

  get active()
  {
    return this.#value > 0;
  }

  public toggle()
  {
    if (this.#options === undefined)
    {
      this.#value = 1 - this.#value;
    }
    else
    {
      this.#value = (this.#value + 1) % this.#options.length;
    }
  }

  public render(k: string, d: Datapath)
  {
    return (<ControlView key={k} c={this} d={d} />)
  }
}

class ControlView extends React.Component<{ c: Control, d: Datapath }>
{
  render()
  {
    const { x, y, width, height, label, active } = this.props.c;
    const offset = 4;
    const lx = x;
    const vx = lx + offset;
    const ly = y;
    const hy = y + height - offset;
    const labelStyle = { x: vx, y: hy };
    const rectClass = 'control ' + (active ? 'active' : 'inactive');
    const handleClick = () => {
      this.props.c.toggle();
      this.props.d.eval()
    };
    return (
      <g className="component">
        <rect className={rectClass} x={lx} y={ly} width={width} height={height} onClick={handleClick} />
        <text className="label" {...labelStyle} onClick={handleClick}>{label}</text>
      </g>);
  }
};
