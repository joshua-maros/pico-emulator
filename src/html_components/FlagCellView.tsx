// Displays a flag

import React from 'react';
import { FlagCell } from '../utils/memory_cells';
import style from './FlagCellView.module.css';

export default class FlagCellView extends React.Component<{ flag: FlagCell }> {
  render()
  {
    let text;
    const v = this.props.flag.value;
    if (v === true)
    {
      text = 'T';
    }
    else if (v === false)
    {
      text = 'F';
    }
    else
    {
      text = '?'
    }
    return (
      <div className={style.root}>{text}</div>
    )
  }
}