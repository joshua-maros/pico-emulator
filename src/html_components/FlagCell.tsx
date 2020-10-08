// Displays a flag

import React from 'react';
import PicoFlag from '../utils/PicoFlag';
import style from './FlagCell.module.css';

export default class FlagCell extends React.Component<{ flag: PicoFlag }> {
  render()
  {
    return (
      <div className={style.root}>{this.props.flag.value ? 'T' : 'F'}</div>
    )
  }
}