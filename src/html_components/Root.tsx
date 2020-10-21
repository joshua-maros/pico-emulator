import React from 'react';
import ProgrammerLayout from './ProgrammerLayout';
import Pico from '../utils/PicoV3';
import { Datapath, DatapathView } from '../logic/Datapath';
import { And } from '../logic/gates';
import { Control } from '../logic/control';
import { Bus } from '../logic/connections';

export default class Root extends React.Component<{ pico: Pico }> {
  render()
  {
    // return (<ProgrammerLayout pico={this.props.pico} />);
    const datapath = new Datapath();
    const c1 = new And("asdf", 30, 30);
    const c2 = new Control('test', 10, 10, 'asdfflag', false);
    const b = new Bus();
    c1.connectInput('in0', b);
    c2.connectOutput('out', b);
    datapath.addComponent(c1);
    datapath.addComponent(c2);
    return (<DatapathView datapath={datapath}/>)
  }
}