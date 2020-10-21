import React from 'react';
import { LogicComponent } from "./component";
import { Bus } from "./connections";

export class Datapath
{
  #components: Array<LogicComponent> = [];
  #buses: Array<Bus> = [];

  get components(): Array<LogicComponent>
  {
    return this.#components;
  }

  public addComponent(component: LogicComponent)
  {
    this.#components.push(component);
  }

  public addBus(bus: Bus)
  {
    this.#buses.push(bus);
  }
}

export class DatapathView extends React.Component<{ datapath: Datapath }>
{
  render()
  {
    const children = this.props.datapath.components.map(c => c.render());
    return (<svg className="datapath">
      {children}
    </svg>);
  }
}
