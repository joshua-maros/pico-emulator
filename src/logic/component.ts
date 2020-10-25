import { Bus } from "./connections";
import { Datapath } from "./datapath";

export class Input
{
  // This should return the value of what the input is connected to when called.
  #connection: Bus | undefined;

  constructor(
    public name: string,
    public x: number,
    public y: number,
  ) { }

  // Mark that the value from this input has been used for something.
  public set used(used: boolean)
  {
    if (used && this.#connection !== undefined)
    {
      this.#connection.markUsedBy(this);
    }
  }

  // Set the connection of this input 
  setConnection(connection: Bus)
  {
    this.#connection = connection;
  }

  // Returns the value being fed into this input. Returns undefined i this input is not being fed
  // a value.
  get value(): string | undefined
  {
    if (this.#connection === undefined)
    {
      return undefined;
    }
    else
    {
      return this.#connection.value;
    }
  }

  // Returns the value being fed into this input as a boolean. Throws an error if this input is 
  // being fed a value that is not a boolean. Returns undefined if this input is not being fed a
  // value.
  get asBoolean(): boolean | undefined
  {
    let value = this.value;
    if (typeof value === 'string')
    {
      if (value === '0' || value === 'false')
      {
        return false;
      }
      else if (value === '1' || value === 'true')
      {
        return true;
      }
      throw new Error('Emulator error: ' + value + ' is not a valid boolean.');
    }
    return undefined;
  }

  // Returns the value being fed into this input as an integer. Throws an error if this input is 
  // being fed a value that is not an integer. Returns undefined if this input is not being fed a
  // value.
  get asInteger(): number | undefined
  {
    let value = this.value;
    if (typeof value === 'string')
    {
      try
      {
        return parseInt(value);
      }
      catch
      {
        throw new Error('Emulator error: ' + value + ' is not a valid boolean.');
      }
    }
    return undefined;
  }
}

export class Output
{
  // The value that is being outputted. Undefined if we are not outputting anything.
  #value: string | undefined = undefined;
  #connection: Bus | undefined;

  constructor(
    public name: string,
    public x: number,
    public y: number,
  ) { }

  set connection(connection: Bus)
  {
    this.#connection = connection;
  }

  public get used(): boolean
  {
    return this.#connection?.used || false;
  }

  // Returns the value this output is currently outputting, undefined if nothing is being outputted.
  get value(): string | undefined
  {
    return this.#value;
  }

  get asUserText(): string
  {
    let value = this.value;
    if (value === undefined)
    {
      return '?';
    }
    return value;
  }

  // Sets the value of this output. Use undefined to clear the output.
  set value(value: string | undefined)
  {
    this.#value = value;
  }

  // Sets the value of this output as if it were a boolean. Use undefined to clear the output.
  set asBoolean(value: boolean | undefined)
  {
    if (typeof value === 'boolean')
    {
      // This way it also works as a number.
      this.value = value ? '1' : '0';
    }
    else
    {
      this.value = undefined;
    }
  }

  // Sets the value of this output as if it were an integer. Use undefined to clear the output.
  set asInteger(value: number | undefined)
  {
    if (typeof value === 'number')
    {
      this.value = value.toFixed(0);
    }
    else
    {
      this.value = undefined;
    }
  }

  // Clears this output, equivalent to this.value = undefined;
  public clear()
  {
    this.value = undefined;
  }
}

export abstract class LogicComponent
{
  // Type is used for error messages, e.g. [type] has no input named [bad name].
  constructor(
    private type: string,
    public id: string,
    public x: number,
    public y: number) { }

  // Evaluates this logic component, updating its outputs accordingly. This is
  // done when inputs change in between clock cycles.
  public eval() { }

  // Called when a cycle ends. Eval() will always be called one or more times
  // before this is called. Example usage of this is in latches, where the
  // value is only stored at the end of the clock cycle.
  public evalClock() { }

  // Called when the user requests the processor to be reset.
  public reset() { }

  // Connects the input with the given name to the provided bus, if it exists.
  // An error is thrown if it does not exist.
  public connectInput(name: string, bus: Bus)
  {
    let maybeInput = (this as any)[name];
    if (maybeInput instanceof Input)
    {
      bus.connectInput(this, maybeInput);
    }
    else
    {
      throw new Error(`Emulator error: ${this.type} has no input named ${name}.`);
    }
  }

  // Connects the output with the given name to the provided bus, if it exists.
  // An error is thrown if it does not exist.
  public connectOutput(name: string, bus: Bus)
  {
    let maybeOutput = (this as any)[name];
    if (maybeOutput instanceof Output)
    {
      bus.connectOutput(this, maybeOutput);
    }
    else
    {
      throw new Error(`Emulator error: ${this.type} has no output named ${name}.`);
    }
  }

  // Returns an SVG element that represents this component visually.
  public abstract render(key: string, d: Datapath): JSX.Element
}

