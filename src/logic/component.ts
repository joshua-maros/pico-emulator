import { Bus, BusInput, BusOutput } from "./connections";

export interface ConnectionPrototype
{
  name: string;
  x: number;
  y: number;
}

export class ConnectedInput
{
  constructor(
    public name: string,
    public x: number,
    public y: number,
    public connection: BusOutput
  ) { }
}

export class ConnectedOutput
{
  constructor(
    public name: string,
    public x: number,
    public y: number,
    public connection: BusInput
  ) { }
}

export class Component
{
  protected inputs: Map<string, ConnectedInput>;
  protected outputs: Map<string, ConnectedOutput>;

  protected constructor(
    inputs: Array<ConnectionPrototype>,
    outputs: Array<ConnectionPrototype>,
    inputConnections: Map<string, Bus>,
    outputConnections: Map<string, Bus>)
  {
    this.inputs = new Map();
    this.outputs = new Map();

    // Check for extra inputs.
    for (let name of inputConnections.keys())
    {
      if (!inputs.some(i => i.name === name))
      {
        throw new Error('Component does not have an input named ' + name);
      }
    }
    // Connect the inputs.
    for (let input of inputs)
    {
      let bus = inputConnections.get(input.name);
      if (bus === undefined)
        throw new Error('Component is missing an input named ' + name);
      // The output of the bus connects to the input of the component.
      let connection = bus.createOutput();
      this.inputs.set(name, {
        ...input,
        connection,
      });
    }

    // Check for extra outputs.
    for (let name of outputConnections.keys())
    {
      if (!outputs.some(i => i.name === name))
      {
        throw new Error('Component does not have an output named ' + name);
      }
    }
    // Connect the outputs.
    for (let output of outputs)
    {
      let bus = outputConnections.get(output.name);
      if (bus === undefined)
        throw new Error('Component is missng an output named ' + name);
      // The output of the component connects to the input of the bus.
      let connection = bus.createInput();
      this.outputs.set(name, {
        ...output,
        connection,
      });
    }
  }
}