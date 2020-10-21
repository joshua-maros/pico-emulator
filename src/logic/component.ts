import { Bus } from "./connections";

export class Input
{
  // This should return the value of what the input is connected to when called. Return undefined
  // if there is no valid value being fed into this input. When an input is created this function 
  // will always return undefined until replaced by an actual connection.
  #connection: () => string | undefined = () => undefined;

  constructor(
    public name: string,
    public x: number,
    public y: number,
  ) { }

  // Set the connection of this input by providing a function which, when called, returns the value
  // that is being fed into this input.
  set connection(connection: () => string | undefined)
  {
    this.#connection = connection;
  }

  // Returns the value being fed into this input. Returns undefined i this input is not being fed
  // a value.
  get value(): string | undefined
  {
    return this.#connection();
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

  constructor(
    public name: string,
    public x: number,
    public y: number,
  ) { }

  // Returns the value this output is currently outputting, undefined if nothing is being outputted.
  get value(): string | undefined
  {
    return this.#value;
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

export class LogicComponent
{
  // Type is used for error messages, e.g. [type] has no input named [bad name].
  constructor(private type: string) { }

  // Evaluates this logic component, updating its outputs accordingly. This is
  // done when inputs change in between clock cycles.
  public eval() { }

  // Connects the input with the given name to the provided bus, if it exists.
  // An error is thrown if it does not exist.
  public connectInput(name: string, bus: Bus)
  {
    let maybeInput = (this as any)[name];
    if (maybeInput instanceof Input)
    {
      bus.connectInput(maybeInput);
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
      bus.connectOutput(maybeOutput);
    }
    else
    {
      throw new Error(`Emulator error: ${this.type} has no output named ${name}.`);
    }
  }
}