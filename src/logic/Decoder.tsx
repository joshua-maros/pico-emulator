import React from 'react';
import { Input, LogicComponent } from "./component";
import { Control } from './control';
import { Datapath } from './datapath';

// This is microcode as specified in a JSON file. It may or may not be legal
// depending on what the rest of the datapath looks like. Format of controls
// is [CONTROL_NAME] for simple true/false controls and [CONTROL_NAME]:[VALUE]
// for controls with custom options..
export interface UnparsedDecoderMicrocode
{
  clockCycleNames: Array<string>,
  fetchCycleStep: string,
  instructions: Array<string>,
}

function parseControlList(input: string, datapath: Datapath): () => void
{
  // Otherwise we will try and parse a control with a blank name.
  if (input.trim().length === 0) return () => { };
  let actions: Array<{ control: Control, value: number }> = [];
  for (const controlDesc of input.trim().split(','))
  {
    const parts = controlDesc.trim().split(':');
    const cname = parts[0];
    let option: boolean | string = true;
    if (parts.length > 1)
    {
      option = parts[1];
    }
    let success = false;
    for (const control of datapath.controls)
    {
      if (control.name === cname)
      {
        success = true;
        const value = control.getValueOfOption(option);
        actions.push({ control, value });
        break;
      }
    }
    if (!success)
    {
      throw new Error('There is no control named ' + cname);
    }
  }
  return () =>
  {
    for (const { control, value } of actions)
    {
      control.setValue(value);
    }
  };
}

function parseDecoderMicrocode(input: UnparsedDecoderMicrocode, datapath: Datapath): DecoderMicrocode
{
  const result = new DecoderMicrocode();
  result.clockCycleNames = input.clockCycleNames;
  result.fetchCycleAction = parseControlList(input.fetchCycleStep, datapath);
  for (const instr of input.instructions)
  {
    const parts = instr.trim().split(';');
    const opcode = parts[0];
    const steps = parts.slice(1);
    if (steps.length > result.clockCycleNames.length - 1)
    {
      throw new Error('The instruction ' + opcode + ' has too many steps! Try adding another step to clockCycleNames.');
    }
    result.instructions.push({
      opcode: opcode.trim(),
      steps: steps.map(step => parseControlList(step.trim(), datapath))
    });
  }
  return result;
}

class DecoderInstruction
{
  opcode = "";
  steps: Array<() => void> = [];
}

class DecoderMicrocode
{
  clockCycleNames: Array<string> = ['t0'];
  fetchCycleAction = () => { };
  instructions: Array<DecoderInstruction> = [];
}

export class Decoder extends LogicComponent
{
  // The names of the fields need to match the names given to the constructor.
  public in = new Input('in', 0, 10);
  #enabled = true;
  #datapath: Datapath;
  #microcode: DecoderMicrocode;
  #currentCycle = 0;

  constructor(d: Datapath, id: string, x: number, y: number, params: any)
  {
    super(d, "Decoder", id, x, y);
    d.decoder = this;
    this.#datapath = d;
    this.#microcode = new DecoderMicrocode();
  }

  public get enabled(): boolean
  {
    return this.#enabled;
  }

  public set enabled(value: boolean)
  {
    this.#enabled = value;
    this.#datapath.eval();
  }

  public loadMicrocode(input: UnparsedDecoderMicrocode)
  {
    this.#microcode = parseDecoderMicrocode(input, this.#datapath);
  }

  public get statusDesc(): string
  {
    return this.#microcode.clockCycleNames[this.#currentCycle];
  }

  private getCurrentInstruction(): DecoderInstruction
  {
    const currentInstruction = this.in.value;
    if (currentInstruction === undefined)
    {
      throw new Error('Uninitialized value used as instruction.');
    }
    const opcode = currentInstruction.trim().split(' ').reverse().pop();
    if (opcode === undefined)
    {
      throw new Error(currentInstruction + ' is not a valid instruction.');
    }
    for (const instr of this.#microcode.instructions)
    {
      if (instr.opcode === opcode)
      {
        return instr;
      }
    }
    throw new Error(opcode + ' is not a valid instruction opcode.');
  }

  private doCurrentStepAction()
  {
    if (this.#currentCycle === 0)
    {
      return this.#microcode.fetchCycleAction();
    }
    else
    {
      const steps = this.getCurrentInstruction().steps;
      if (this.#currentCycle - 1 < steps.length)
      {
        steps[this.#currentCycle - 1]();
      }
    }
  }

  public eval()
  {
    if (!this.#enabled) return;
    const d = this.#datapath;
    for (const c of d.controls)
    {
      c.reset();
    }
    this.doCurrentStepAction();
  }

  public evalClock()
  {
    if (!this.#enabled) return;
    this.#currentCycle += 1;
    if (this.#currentCycle === this.#microcode.clockCycleNames.length)
    {
      this.#currentCycle = 0;
    }
  }

  public reset()
  {
    this.#currentCycle = 0;
  }

  public render(k: string, d: Datapath)
  {
    return (<DecoderView key={k} c={this} d={d} />)
  }
}

class DecoderView extends React.Component<{ c: Decoder, d: Datapath }>
{
  render()
  {
    const { x, y, enabled, statusDesc } = this.props.c;
    const xfrm = 'translate(' + x + ',' + y + ')';
    const handleClick = () =>
    {
      this.props.c.enabled = !enabled;
      if (this.props.c.enabled === false)
      {
        for (const c of this.props.d.controls)
        {
          c.reset();
        }
      }
      this.props.d.eval();
    };
    return (
      <g transform={xfrm} className="component" onClick={handleClick}>
        <rect x={0} y={0} width={50} height={20} className={enabled ? 'active' : 'inactive'} />
        <text className="small-label" x={25} y={13} textAnchor="middle">decoder</text>
        <text className="value" x={0} y={35}>{statusDesc}</text>
      </g>);
  }
};
