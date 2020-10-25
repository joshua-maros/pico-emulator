// Displays a value in memory or in a register.

import React from 'react';
import { MemoryCell } from '../utils/memory_cells';
import style from './MemoryCellView.module.css';

type Props = {
  cell: MemoryCell,
  onClick: () => void,
  focused: boolean,
}

export default class MemoryCellView extends React.Component<Props> {
  render()
  {
    const v = this.props.cell.value;
    const text = v === undefined ? '?' : v;
    return (
      <div
        onClick={_e => this.props.onClick()}
        className={
          style.root
          + (this.props.focused ? ' ' + style.focused : '')
        }
      >
        {text}
      </div>
    )
  }
}