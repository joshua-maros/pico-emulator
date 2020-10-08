// Displays all 128 bytes of memory in a big grid.

import React from 'react';
import RegisterCell from './RegisterCell';
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
      children.push((<span key={`label${row}`} className={style.label}>{row}</span>));
      children.push((<RegisterCell key={`item${row + 0}`} reg={this.props.memory.get(row + 0)} />));
      children.push((<RegisterCell key={`item${row + 32}`} reg={this.props.memory.get(row + 32)} />));
      children.push((<RegisterCell key={`item${row + 64}`} reg={this.props.memory.get(row + 64)} />));
      children.push((<RegisterCell key={`item${row + 96}`} reg={this.props.memory.get(row + 96)} />));
    }
    return (
      <div className={style.root}>
        {children}
      </div>
    )
  }
}