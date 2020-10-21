import React from 'react';
import ProgrammerLayout from './ProgrammerLayout';
import Pico from '../utils/PicoV3';
import { Datapath, DatapathView } from '../logic/datapath';

export default class Root extends React.Component<{ pico: Pico }> {
  render()
  {
    // return (<ProgrammerLayout pico={this.props.pico} />);
    const datapath = new Datapath();
    datapath.loadDef({
      components: [
        { type: "And", id: "and", x: 200, y: 30, },
        { type: "Control", id: "c0", x: 10, y: 70, name: "asdf" },
        { type: "Control", id: "c1", x: 90, y: 70, name: "asdf2" },
      ],
      wires: [
        { inputs: ["c0.out"], outputs: ["and.in0"], path: "VH" },
        { inputs: ["c1.out"], outputs: ["and.in1"], path: "VH" },
      ]
    });
    return (<DatapathView datapath={datapath}/>)
  }
}