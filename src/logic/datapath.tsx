import React from 'react';
import { FlagCell, MemoryCell } from '../utils/memory_cells';
import { ALU } from './ALU';
import { LogicComponent } from "./component";
import { Bus } from "./connections";
import { Control } from './control';
import { Expand } from './Expand';
import { FlagLogic } from './FlagLogic';
import { And, AndOr, Or } from './gates';
import { Incrementer } from './Incrementer';
import { Latch } from './Latch';
import { MainMemory } from './MainMemory';
import { Mux } from './Mux';
import { Probe } from './Probe';
import { Tristate } from './Tristate';
import { Wire } from './Wire';

export interface DatapathDef
{
  width?: number,
  height?: number,
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

type ComponentMaker = (d: Datapath, id: string, x: number, y: number, params: Map<string, any>) => LogicComponent;
const componentTypes: Map<string, ComponentMaker> = new Map([
  ["ALU", (d, i, x, y, p): LogicComponent => new ALU(d, i, x, y, p)],
  ["And", (d, i, x, y, p): LogicComponent => new And(d, i, x, y, p)],
  ["AndOr", (d, i, x, y, p): LogicComponent => new AndOr(d, i, x, y, p)],
  ["Control", (d, i, x, y, p): LogicComponent => new Control(d, i, x, y, p)],
  ["Expand", (d, i, x, y, p): LogicComponent => new Expand(d, i, x, y, p)],
  ["FlagLogic", (d, i, x, y, p): LogicComponent => new FlagLogic(d, i, x, y, p)],
  ["Incrementer", (d, i, x, y, p): LogicComponent => new Incrementer(d, i, x, y, p)],
  ["Latch", (d, i, x, y, p): LogicComponent => new Latch(d, i, x, y, p)],
  ["MainMemory", (d, i, x, y, p): LogicComponent => new MainMemory(d, i, x, y, p)],
  ["Mux", (d, i, x, y, p): LogicComponent => new Mux(d, i, x, y, p)],
  ["Or", (d, i, x, y, p): LogicComponent => new Or(d, i, x, y, p)],
  ["Probe", (d, i, x, y, p): LogicComponent => new Probe(d, i, x, y, p)],
  ["Tristate", (d, i, x, y, p): LogicComponent => new Tristate(d, i, x, y, p)],
]);

export class Datapath
{
  #components: Array<LogicComponent> = [];
  #wires: Array<Wire> = [];
  #buses: Array<Bus> = [];
  changeListener: () => void = () => { };

  public width: number = 800;
  public height: number = 600;
  public visibleFlags: Array<FlagCell> = [];
  public visibleRegisters: Array<MemoryCell> = [];
  public mainMemoryBlock: Array<MemoryCell> = [];
  public controls: Array<Control> = [];

  // Are we 'running' the code for a processor?
  #running = false;
  // Are we running fast or slow?
  #fast = false;
  // The timer used while running
  #timer: number | undefined = undefined;

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
      let component = builder(this, cdef.id, cdef.x, cdef.y, cdef);
      if (component instanceof Control)
      {
        this.controls.push(component);
      }
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
        if (comp === undefined)
        {
          throw new Error(`Emulator error: could not find a gate with id '${cid}'.`);
        }
        comp.connectOutput(pin, bus);
      }
      for (const odef of wdef.outputs)
      {
        let [cid, pin] = odef.split('.');
        let comp = findComp(cid);
        if (comp === undefined)
        {
          throw new Error(`Emulator error: could not find a gate with id '${cid}'.`);
        }
        comp.connectInput(pin, bus);
      }
      let wire = new Wire(bus, wdef.path, wdef.inputs, wdef.outputs);
      this.#buses.push(bus);
      this.#wires.push(wire);
    }
    if (def.width)
    {
      this.width = def.width;
    }
    if (def.height)
    {
      this.height = def.height;
    }
    this.reset();
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

  // Resets all components.
  public reset()
  {
    for (let c of this.#components)
    {
      c.reset();
    }
  }

  // Evaluates all components, propogating any changes made by the user or
  // the program.
  public eval()
  {
    // This is a hacky way to make sure changes propogate through the whole circuit.
    const doWork = (iters: number) =>
    {
      for (let i = 0; i < iters; i++)
      {
        for (let c of this.#components)
        {
          c.eval();
        }
      }
    };
    doWork(5);
    for (const b of this.#buses)
    {
      b.clearUsedBy();
    }
    doWork(10);
    this.changeListener();
  }

  // Does a clock signal without doing eval before or after.
  public clock()
  {
    for (let c of this.#components)
    {
      c.evalClock();
    }
  }

  startRunning(fast: boolean)
  {
    this.#fast = fast;
    if (this.#running === false)
    {
      this.#running = true;
      this.timerTick();
    }
  }

  // Stop the current 'run' of the processor
  halt()
  {
    if (this.#running) {
      clearTimeout(this.#timer);
      this.#running = false;
    }
  }

  private timerTick()
  {
    clearTimeout(this.#timer);
    this.#timer = undefined;
    this.clock();
    this.eval();
    if (this.#running)
    {
      let speed = this.#fast ? 200 : 2000;
      this.#timer = window.setTimeout(() => this.timerTick(), speed);
    }
  }
}

export class DatapathView extends React.Component<{ datapath: Datapath, className: string }>
{
  constructor(props: { datapath: Datapath, className: string })
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
    let { width, height } = this.props.datapath;

    return (<svg className={"datapath " + this.props.className} viewBox={`0 0 ${width} ${height}`}>
      {children}
    </svg>);
  }
}
