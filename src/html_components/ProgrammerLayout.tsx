// This is the layout users should see if they don't want to look at the whole
// datapath and just want to prorgram the processor.

import React from 'react';
import MemoryGrid from './MemoryGrid';
import Pico from '../utils/PicoV3';

export default class ProgrammerLayout extends React.Component<{ pico: Pico }> {
  render()
  {
    return (<MemoryGrid memory={this.props.pico.memory} />)
  }
}