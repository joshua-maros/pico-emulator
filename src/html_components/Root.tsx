import React from 'react';
import ProgrammerLayout from './ProgrammerLayout';
import Pico from '../utils/PicoV3';

export default class Root extends React.Component<{ pico: Pico }> {
  render()
  {
    return (<ProgrammerLayout pico={this.props.pico} />);
  }
}