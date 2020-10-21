import React from 'react';
import ProgrammerLayout from './ProgrammerLayout';
import Pico from '../utils/PicoV3';
import { Datapath, DatapathView } from '../logic/Datapath';
import { And } from '../logic/gates';
import { Control } from '../logic/control';
import { Bus } from '../logic/connections';
import { Wire } from '../logic/Wire';

export default class Root extends React.Component<{ pico: Pico }> {
  render()
  {
    // return (<ProgrammerLayout pico={this.props.pico} />);
    const datapath = new Datapath();
    const c1 = new And("asdf", 200, 30);
    const c2 = new Control('test', 10, 70, 'asdf', true);
    const b = new Bus();
    c1.connectInput('in0', b);
    c2.connectOutput('out', b);
    const wire = new Wire(b, 'VH');
    datapath.addComponent(c1);
    datapath.addComponent(c2);
    datapath.addWire(wire);
    return (<DatapathView datapath={datapath}/>)
  }
}