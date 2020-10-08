// Displays all 128 bytes of memory in a big grid.

import React from 'react';
import RegisterCell from './RegisterCell';
import style from './MemoryGrid.module.css';
import PicoMemory from '../utils/PicoMemory';

type Props = {
  memory: PicoMemory,
  onClick: (index: number) => void,
  focusedIndex: number | null,
}

export default class MemoryGrid extends React.Component<Props> {
  render()
  {
    const makeRegisterCell = (index: number) =>
    {
      return (
        <RegisterCell
          key={`item${index}`}
          reg={this.props.memory.get(index)}
          onClick={() => this.props.onClick(index)}
          focused={index === this.props.focusedIndex}
        />
      )
    };
    // CSS grid adds items from left to right, but logically they are ordered
    // top to bottom. 
    let children = [];
    for (let row = 0; row < 32; row++)
    {
      children.push((<span key={`label${row}`} className={style.label}>{row}</span>));
      children.push(makeRegisterCell(row + 0));
      children.push(makeRegisterCell(row + 32));
      children.push(makeRegisterCell(row + 64));
      children.push(makeRegisterCell(row + 96));
    }
    return (
      <div className={style.root}>
        {children}
      </div>
    )
  }
}