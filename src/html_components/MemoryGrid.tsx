// Displays all 128 bytes of memory in a big grid.

import React from 'react';
import MemoryCell from './MemoryCell';
import style from './MemoryGrid.module.css';
import PicoMemory from '../utils/PicoMemory';

export default class MemoryGrid extends React.Component<{ memory: PicoMemory }> {
  render()
  {
    // CSS grid adds items from left to right, but logically they are ordered
    // top to bottom. 
    let children = [];
    for (let row = 0; row < 32; row++)
    {
      children.push((<span className={style.label}>{row}</span>));
      children.push((<MemoryCell memory={this.props.memory} index={row + 0} />));
      children.push((<MemoryCell memory={this.props.memory} index={row + 32} />));
      children.push((<MemoryCell memory={this.props.memory} index={row + 64} />));
      children.push((<MemoryCell memory={this.props.memory} index={row + 96} />));
    }
    return (
      <div className={style.root}>
        {children}
      </div>
    )
  }
}