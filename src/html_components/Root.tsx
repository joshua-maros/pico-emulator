import React from 'react';
import ProgrammerLayout from './ProgrammerLayout';
import Pico from '../utils/PicoV3';
import { Datapath, DatapathView } from '../logic/Datapath';
import { And } from '../logic/gates';

export default class Root extends React.Component<{ pico: Pico }> {
  render()
  {
    // return (<ProgrammerLayout pico={this.props.pico} />);
    const datapath = new Datapath();
    datapath.addComponent(new And("asdf", 0, 0));
    return (<DatapathView datapath={datapath}/>)
  }
}