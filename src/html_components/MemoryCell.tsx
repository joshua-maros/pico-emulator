// Displays a byte of memory.

import React from 'react';
import PicoMemory from '../utils/PicoMemory';
import style from './MemoryCell.module.css';

export default class MemoryCell extends React.Component<{ memory: PicoMemory, index: number }> {
  render()
  {
    let value = this.props.memory.getValue(this.props.index);
    return (
      <div className={style.root}>{value}</div>
    )
  }
}