import React from 'react';
import { ComponentUsageError, Input, LogicComponent, Output } from "./component";
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

// This parses bits that come on ends of expressions embedded in messages as
// parsed by parseCompleteMessage(). For example, this function would parse the
// conditional portion in "<Flags?Skipped:Did not skip> the next instruction."
function makeProceduralPiece(input: string, valueSource: Output, datapath: Datapath): () => string
{
  if (input.includes('-'))
  {
    const decrement = input.split('-')[1];
    const pdec = parseInt(decrement);
    return () =>
    {
      const v = valueSource.value;
      console.log(v);
      return v === undefined ? '?' : '' + (parseInt(v) - pdec);
    }
  }
  else if (input.includes('+'))
  {
    const decrement = input.split('+')[1];
    const pdec = parseInt(decrement);
    return () =>
    {
      const v = valueSource.value;
      console.log(v);
      return v === undefined ? '?' : '' + (parseInt(v) + pdec);
    }
  }
  else if (input.includes('?'))
  {
    const choicestr = input.split('?')[1];
    const choices = choicestr.split(':');
    return () =>
    {
      const v = valueSource.value;
      console.log(v);
      if (v === 'true' || v === '1')
      {
        return choices[0];
      }
      else
      {
        return choices[1];
      }
    }
  }
  else
  {
    return () =>
    {
      const v = valueSource.value;
      return v === undefined ? '?' : v;
    };
  }
}

// This is responsible for parsing the description of a message that should display
// when the instruction finishes executing.
function parseMessageExpression(input: string, datapath: Datapath): () => string
{
  let pieces: Array<() => string> = [];
  let buffer = '';
  let parsingExpr = false;
  for (const c of input)
  {
    if (c === '<' && !parsingExpr)
    {
      const copied = '' + buffer;
      pieces.push(() => copied);
      buffer = '';
      parsingExpr = true;
    }
    else if (c === '>' && parsingExpr)
    {
      const compId = buffer.split(/[-+?]/)[0];
      let success = false;
      for (const c of datapath.components)
      {
        if (c.id === compId)
        {
          success = true;
          const output = (c as any).out;
          if (output instanceof Output)
          {
            pieces.push(makeProceduralPiece(buffer, output, datapath));
          }
          else
          {
            throw new Error('The component ' + compId + ' does not have an output named "out", so it cannot be used in this expression:\n' + input);
          }
        }
      }
      if (!success)
      {
        throw new Error('There is no component with ID ' + compId);
      }
      buffer = '';
      parsingExpr = false;
    }
    else
    {
      buffer += c;
    }
  }
  pieces.push(() => buffer);
  return () =>
  {
    let result = '';
    for (const piece of pieces)
    {
      result += piece();
    }
    return result;
  };
}

class StepResult
{
  // If nextCycle is -1, indicates default.
  constructor(public readonly makeMessage: boolean, public readonly nextCycleOverride: number) { }
}

// Parses a list of controls that will be activated during a cycle.
function parseControlList(
  cycleNames: Array<string>,
  input: string,
  datapath: Datapath,
  isLast: boolean,
  previousMessageOverride: boolean
): () => StepResult
{
  // Otherwise we will try and parse a control with a blank name.
  if (input.trim().length === 0) return () => new StepResult(false, -1);
  let actions: Array<{ control: Control, value: number }> = [];
  let makeMessage = false;
  let cycleOverride = -1;
  if (isLast)
  {
    cycleOverride = 0;
    // Automatically generate the message on the last cycle, unless the user had
    // previously set where the message should be generated.
    makeMessage = !previousMessageOverride;
  }
  for (const controlDesc of input.trim().split(','))
  {
    const parts = controlDesc.trim().split(':');
    const cname = parts[0];
    let option: true | string = true;
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
    if (cname === "!message")
    {
      makeMessage = true;
    }
    else if (cname === "!next")
    {
      if (option === true)
      {
        throw new Error('!next must be followed by the name of a cycle, E.G. !next:t1');
      }
      cycleOverride = cycleNames.indexOf(option);
      if (cycleOverride === -1)
      {
        throw new Error('There is no cycle named ' + option);
      }
    }
    else if (!success)
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
    return new StepResult(makeMessage, cycleOverride);
  };
}

function parseDecoderMicrocode(input: UnparsedDecoderMicrocode, datapath: Datapath): DecoderMicrocode
{
  const result = new DecoderMicrocode();
  result.clockCycleNames = input.clockCycleNames;
  const cnames = result.clockCycleNames;
  result.fetchCycleAction = parseControlList(cnames, input.fetchCycleStep, datapath, false, false);
  for (const instr of input.instructions)
  {
    const parts = instr.trim().split(';');
    const completeMessage = parts[0];
    const opcode = parts[1];
    const steps = parts.slice(2);
    if (steps.length > result.clockCycleNames.length - 1)
    {
      throw new Error('The instruction ' + opcode + ' has too many steps! Try adding another step to clockCycleNames.');
    }
    let parsedSteps = [];
    let pmo = false;
    for (let i = 0; i < steps.length; i++)
    {
      let last = i === steps.length - 1;
      let parsed = parseControlList(cnames, steps[i].trim(), datapath, last, pmo);
      parsedSteps.push(parsed);
      // Keep track of whether or not the user has specified on which cycle the
      // message should be generated.
      pmo = pmo || steps[i].includes('!message');
    }
    result.instructions.push({
      opcode: opcode.trim(),
      messageGenerator: parseMessageExpression(completeMessage, datapath),
      steps: parsedSteps,
    });
  }
  return result;
}

class DecoderInstruction
{
  opcode = "";
  messageGenerator = () => "";
  steps: Array<() => StepResult> = [];
}

class DecoderMicrocode
{
  clockCycleNames: Array<string> = ['t0'];
  fetchCycleAction = () => new StepResult(false, -1);
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
  #lastInstrDesc = '';

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
      throw new ComponentUsageError('Uninitialized value used as instruction.');
    }
    const opcode = currentInstruction.trim().split(' ').reverse().pop();
    if (opcode === undefined)
    {
      throw new ComponentUsageError(currentInstruction + ' is not a valid instruction.');
    }
    for (const instr of this.#microcode.instructions)
    {
      if (instr.opcode === opcode)
      {
        return instr;
      }
    }
    throw new ComponentUsageError(opcode + ' is not a valid instruction opcode.');
  }

  private doCurrentStepAction(): StepResult
  {
    if (this.#currentCycle === 0)
    {
      return this.#microcode.fetchCycleAction();
    }
    else if (this.in.value === 'HLT')
    {
      // This is special cased because the clock (and correspondingly halting) 
      // is controlled by regular javascript code and has no corresponding 
      // component.
      this.#datapath.haltRequested = true;
    }
    else
    {
      const steps = this.getCurrentInstruction().steps;
      if (this.#currentCycle - 1 < steps.length)
      {
        return steps[this.#currentCycle - 1]();
      }
    }
    return new StepResult(false, -1);
  }

  public eval()
  {
    if (!this.#enabled) return;
    const d = this.#datapath;
    for (const c of d.controls)
    {
      c.reset();
    }
    const after = this.doCurrentStepAction();
    if (this.in.value !== undefined && this.in.value !== 'HLT')
    {
      const ci = this.getCurrentInstruction();
      if (after.makeMessage)
      {
        this.#lastInstrDesc = ci.messageGenerator();
      }
    }
  }

  public evalClock()
  {
    if (!this.#enabled) return;
    const after = this.doCurrentStepAction();
    if (after.nextCycleOverride >= 0)
    {
      this.#currentCycle = after.nextCycleOverride;
    } else
    {
      this.#currentCycle += 1;
      if (this.#currentCycle === this.#microcode.clockCycleNames.length)
      {
        this.#currentCycle = 0;
      }
    }
    this.#datapath.decoderCycleFinished = this.#currentCycle === 0;
  }

  // Call this after an instruction has completed to get a description of what
  // just happened.
  public getInstructionDescription(): string
  {
    if (this.in.value === 'HLT')
    {
      return 'Processor halted.';
    }
    else
    {
      return this.#lastInstrDesc;
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
