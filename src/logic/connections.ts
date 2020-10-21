export enum BusException
{
  Inactive,
  Conflict,
}

export class Bus
{
  public static Input = class
  {
    // Either a value or inactive.
    #value: string | BusException.Inactive = '';
    constructor(private bus: Bus) { }

    get active()
    {
      return this.#value !== BusException.Inactive;
    }

    get value()
    {
      return this.#value;
    }

    // Updates the input with the new value. Updates the bus this input is
    // attached to. Put in a null value to make the input inactive.
    setValue(value: string | BusException.Inactive)
    {
      let shouldBeActive = value !== BusException.Inactive;
      if (shouldBeActive && !this.active)
      {
        this.bus.#activeInputs.push(this);
      } else if (!shouldBeActive && this.active)
      {
        let thisIndex = this.bus.#activeInputs.indexOf(this);
        this.bus.#activeInputs.splice(thisIndex, 1);
      }
      this.#value = value;
    }

    // Equivalent to setValue(BusException.Inactive)
    clearValue()
    {
      this.setValue(BusException.Inactive);
    }
  };

  public static Output = class
  {
    constructor(private bus: Bus) { }


    get value()
    {
      return this.bus.value;
    }
  };

  // Stores the inputs which are currently active.
  #activeInputs: Array<BusInput> = [];

  createInput(): BusInput
  {
    return new BusInput(this);
  }

  createOutput(): BusOutput
  {
    return new BusOutput(this);
  }

  // Returns the current value of this bus as a string if valid, or a variant of
  // BusException otherwise.
  get value(): string | BusException.Inactive | BusException.Conflict
  {
    if (this.#activeInputs.length === 0)
    {
      return BusException.Inactive;
    }
    else if (this.#activeInputs.length > 1)
    {
      return BusException.Conflict;
    }
    return this.#activeInputs[0].value;
  }
}

// Why does this work? Why is it necessary? For centuries, philosophers have
// struggled with these great questions...
export const BusInput = Bus.Input;
let bus = new Bus();
let input = new Bus.Input(bus);
export type BusInput = typeof input;
export const BusOutput = Bus.Output;
let output = new Bus.Output(bus);
export type BusOutput = typeof output;
