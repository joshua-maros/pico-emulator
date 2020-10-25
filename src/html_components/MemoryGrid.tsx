// Displays all 128 bytes of memory in a big grid.

import React from 'react';
import MemoryCellView from './MemoryCellView';
import style from './MemoryGrid.module.css';
import PicoMemory from '../utils/PicoMemory';
import { MemoryCell } from '../utils/memory_cells';

type Props = {
  memoryBlock: Array<MemoryCell>,
  onClick: (index: number) => void,
  focusedIndex: number | undefined,
}

export default class MemoryGrid extends React.Component<Props> {
  render()
  {
    const makeRegisterCell = (index: number) =>
    {
      return (
        <MemoryCellView
          key={`item${index}`}
          cell={this.props.memoryBlock[index]}
          onClick={() => this.props.onClick(index)}
          focused={index === this.props.focusedIndex}
        />
      )
    };
    // CSS grid adds items from left to right, but logically they are ordered
    // top to bottom. 
    let children = [];
    const columnSize = Math.ceil(this.props.memoryBlock.length / 4);
    for (let row = 0; row < columnSize; row++)
    {
      children.push((<span key={`label${row}`} className={style.label}>{row}</span>));
      children.push(makeRegisterCell(row + columnSize * 0));
      children.push(makeRegisterCell(row + columnSize * 1));
      children.push(makeRegisterCell(row + columnSize * 2));
      children.push(makeRegisterCell(row + columnSize * 3));
    }
    return (
      <div className={style.root}>
        {children}
      </div>
    )
  }
}