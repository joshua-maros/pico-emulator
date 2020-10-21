import { Input, Output } from "./component";

export enum BusException
{
  Inactive,
  Conflict,
}

export class Bus
{
  // The inputs to the bus are the outputs of components.
  #inputs: Array<Output> = [];

  // Returns the current value of this bus as a string if valid, or a variant of
  // BusException otherwise.
  get displayValue(): string | BusException.Inactive | BusException.Conflict
  {
    let activeInputs = 0;
    let value: string | BusException.Inactive = BusException.Inactive;
    for (let input of this.#inputs)
    {
      if (input.value !== undefined) 
      {
        if (activeInputs === 0)
        {
          value = input.value;
        }
        else
        {
          // This would now be the second active input we've found.
          return BusException.Conflict;
        }
      }
    }
    return value;
  }

  // Like getDisplayValue but uses undefined if there is a problem. This is used
  // because it is easier to implement eval() functions this way.
  get value(): string | undefined 
  {
    let activeInputs = 0;
    let value: string | undefined = undefined;
    for (let input of this.#inputs)
    {
      if (input.value !== undefined) 
      {
        if (activeInputs === 0)
        {
          value = input.value;
        }
        else
        {
          // This would now be the second active input we've found.
          return undefined;
        }
      }
    }
    return value;
  }

  // Connects a component's input such that its value is provided by this bus.
  public connectInput(input: Input)
  {
    input.connection = () => this.value;
  }

  // Connects a component's output such that its value is fed into this bus.
  public connectOutput(output: Output)
  {
    this.#inputs.push(output);
  }
}
