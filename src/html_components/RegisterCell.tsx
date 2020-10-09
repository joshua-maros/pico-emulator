// Displays a value in memory or in a register.

import React from 'react';
import PicoReg from '../utils/PicoReg';
import style from './RegisterCell.module.css';

type Props = {
  reg: PicoReg,
  onClick: () => void,
  focused: boolean,
}

export default class RegisterCell extends React.Component<Props> {
  render()
  {
    return (
      <div
        onClick={_e => this.props.onClick()}
        className={
          style.root
          + (this.props.focused ? ' ' + style.focused : '')
          + ' ' + style['use_' + this.props.reg.lastUse]
        }
      >
        {this.props.reg.value}
      </div>
    )
  }
}