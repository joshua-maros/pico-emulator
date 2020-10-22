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
        { type: "Tristate", id: "t0", x: 230, y: 20 },
        { type: "And", id: "and2", x: 320, y: 30, },
        { type: "Control", id: "c2", x: 215, y: 90, name: "asdf3" },
        { type: "Control", id: "c3", x: 280, y: 90, name: "asdf4" },
      ],
      wires: [
        { inputs: ["c0.out"], outputs: ["and.in0"], path: "VH" },
        { inputs: ["c1.out"], outputs: ["and.in1"], path: "VH" },
        { inputs: ["and.out"], outputs: ["t0.in"], path: "H" },
        { inputs: ["c2.out"], outputs: ["t0.enable"], path: "V" },
        { inputs: ["c3.out", "t0.out"], outputs: ["and2.in0"], path: "o 0 xy 1 10 u 50" },
      ]
    });
    return (<DatapathView datapath={datapath}/>)
  }
}