// Displays a value in memory or in a register.

import React from 'react';
import PicoReg from '../utils/PicoReg';
import style from './RegisterCell.module.css';

export default class RegisterCell extends React.Component<{ reg: PicoReg }> {
  render()
  {
    return (
      <div className={style.root}>{this.props.reg.value}</div>
    )
  }
}