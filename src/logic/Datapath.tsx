import React from 'react';
import { LogicComponent } from "./component";
import { Bus } from "./connections";
import { Wire } from './Wire';

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

    return (<svg className="datapath">
      {children}
    </svg>);
  }
}
