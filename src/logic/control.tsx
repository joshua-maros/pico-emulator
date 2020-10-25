import React from 'react';
import { LogicComponent, Output } from "./component";
import { Datapath } from './datapath';

export class Control extends LogicComponent
{
  // The names of the fields need to match the names given to the constructor.
  public out: Output;
  // Values that this control can be. If undefined, then this is a simple 
  // true/false control.
  #options: Array<string> | undefined;
  readonly width: number;
  readonly height: number = 20;
  // 0,1 for bool control, 0-len for option control.
  #value: number = 0;
  public readonly name: string;
  public readonly top: boolean;

  constructor(
    d: Datapath,
    id: string,
    x: number,
    y: number,
    params: any)
  {
    super(d, "Control", id, x, y);

    let top = params.top !== false;
    this.top = top;
    let name: string = params.name || 'Unnamed';
    this.name = name;
    let options = params.options;
    this.#options = options;
    this.width = params.wid || 60;

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

  public reset()
  {
    this.#value = 0;
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

  // Use the value returned by this in setValue(). It will throw an error if 
  // you cannot use the specified setting on this control.
  public getValueOfOption(option: boolean | string): number
  {
    if (this.#options === undefined)
    {
      if (option === true) return 1;
      else if (option === false) return 0;
      else throw new Error(this.name + ' does not have custom options, you must use true/false instead.');
    }
    else
    {
      if (typeof option === 'boolean')
        throw new Error(this.name + ' has custom options, it cannot be set with true/false.');
      for (let i = 0; i < this.#options.length; i++)
      {
        if (this.#options[i] === option)
        {
          return i;
        }
      }
      throw new Error(this.name + ' has no option named ' + option);
    }
  }

  // This function does not check if the provided value is valid.
  public setValue(value: number)
  {
    this.#value = value;
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
    const handleClick = () =>
    {
      // Turn off the decoder if the user wants to change something manually.
      this.props.d.decoderEnabled = false;
      this.props.c.toggle();
      this.props.d.eval()
    };
    return (
      <g className="component" onClick={handleClick}>
        <rect className={rectClass} x={lx} y={ly} width={width} height={height} />
        <text className="label" {...labelStyle}>{label}</text>
      </g>);
  }
};
