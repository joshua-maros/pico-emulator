import React from 'react';
import { ALU } from './ALU';
import { LogicComponent } from "./component";
import { Bus } from "./connections";
import { Control } from './control';
import { And, Or } from './gates';
import { Incrementer } from './Incrementer';
import { Tristate } from './Tristate';
import { Wire } from './Wire';

export interface DatapathDef
{
  components: Array<any & {
    type: string,
    id: string,
    x: number,
    y: number,
  }>,
  wires: Array<{
    inputs: Array<string>,
    outputs: Array<string>,
    path: string,
  }>
}

type ComponentMaker = (id: string, x: number, y: number, params: Map<string, any>) => LogicComponent;
const componentTypes: Map<string, ComponentMaker> = new Map([
  ["ALU", (i, x, y, p): LogicComponent => new ALU(i, x, y, p)],
  ["And", (i, x, y, p): LogicComponent => new And(i, x, y, p)],
  ["Control", (i, x, y, p): LogicComponent => new Control(i, x, y, p)],
  ["Incrementer", (i, x, y, p): LogicComponent => new Incrementer(i, x, y, p)],
  ["Or", (i, x, y, p): LogicComponent => new Or(i, x, y, p)],
  ["Tristate", (i, x, y, p): LogicComponent => new Tristate(i, x, y, p)],
]);

export class Datapath
{
  #components: Array<LogicComponent> = [];
  #wires: Array<Wire> = [];
  #buses: Array<Bus> = [];
  changeListener: () => void = () => { };

  get components(): Array<LogicComponent>
  {
    return this.#components;
  }

  get wires(): Array<Wire>
  {
    return this.#wires;
  }

  public loadDef(def: DatapathDef)
  {
    this.#components = [];
    this.#wires = [];
    this.#buses = [];
    for (const cdef of def.components) 
    {
      let builder = componentTypes.get(cdef.type);
      if (builder === undefined) 
      {
        throw new Error(`Emulator error: '${cdef.type}' is not a valid component type.`);
      }
      let component = builder(cdef.id, cdef.x, cdef.y, cdef);
      this.#components.push(component);
    }
    const findComp = (id: string) => this.#components.find(i => i.id === id);
    for (const wdef of def.wires)
    {
      let bus = new Bus();
      for (const idef of wdef.inputs)
      {
        let [cid, pin] = idef.split('.');
        let comp = findComp(cid);
        if (comp === undefined) {
          throw new Error(`Emulator error: could not find a gate with id '${cid}'.`);
        }
        comp.connectOutput(pin, bus);
      }
      for (const odef of wdef.outputs)
      {
        let [cid, pin] = odef.split('.');
        let comp = findComp(cid);
        if (comp === undefined) {
          throw new Error(`Emulator error: could not find a gate with id '${cid}'.`);
        }
        comp.connectInput(pin, bus);
      }
      let wire = new Wire(bus, wdef.path);
      this.#buses.push(bus);
      this.#wires.push(wire);
    }
    // Eval once to show the initial state of the datapath.
    this.eval();
  }

  public addComponent(component: LogicComponent)
  {
    this.#components.push(component);
  }

  public addBus(bus: Bus)
  {
    this.#buses.push(bus);
  }

  public addWire(wire: Wire)
  {
    this.#wires.push(wire);
  }

  // Evaluates all components, propogating any changes made by the user or
  // the program.
  public eval()
  {
    // This is a hacky way to make sure changes propogate through the whole circuit.
    for (let i = 0; i < 10; i++)
    {
      for (let c of this.#components)
      {
        c.eval();
      }
    }
    this.changeListener();
  }
}

export class DatapathView extends React.Component<{ datapath: Datapath }>
{
  constructor(props: { datapath: Datapath })
  {
    super(props);
    props.datapath.changeListener = () => this.forceUpdate();
  }

  render()
  {
    let key = 0;
    let children: Array<JSX.Element> = [];
    for (const c of this.props.datapath.components)
    {
      children.push(c.render(c.id + key, this.props.datapath));
      key += 1;
    }
    for (const w of this.props.datapath.wires)
    {
      children.push(w.render('wire' + key, this.props.datapath));
      key += 1;
    }

    return (<svg className="datapath" width={1000}>
      {children}
    </svg>);
  }
}
