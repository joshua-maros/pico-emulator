// This is the layout users should see if they don't want to look at the whole
// datapath and just want to prorgram the processor.

import React from 'react';
import MemoryGrid from './MemoryGrid';
import Pico from '../utils/PicoV3';
import style from './ProgrammerLayout.module.css';
import RegisterCell from './RegisterCell';
import FlagCell from './FlagCell';

export default class ProgrammerLayout extends React.Component<{ pico: Pico }> {
  render()
  {
    let pico = this.props.pico;
    return (
      <div className={style.root}>
        <div className={style.left_controls}>
          <div className={style.label}>PC</div>
          <RegisterCell reg={pico.programCounter} />
          <div className={style.label}>ACC</div>
          <RegisterCell reg={pico.accumulator} />
          <div className={style.label}>IR</div>
          <RegisterCell reg={pico.instructionRegister} />
          <div className={style.label}>Q</div>

          <RegisterCell reg={pico.qReg} />
          <div className={style.label}>CARRY</div>
          <FlagCell flag={pico.carryFlag} />
          <div className={style.label}>ZERO</div>
          <FlagCell flag={pico.zeroFlag} />
          <div className={style.label}>NEG</div>
          <FlagCell flag={pico.negFlag} />

          <div />
          <div style={{ height: '1em' }} />

          <div />
          <button>Step</button>
          <div />
          <button>Run</button>
          <div />
          <button>Run Fast</button>
          <div />
          <button>Stop</button>
          <div />
          <button>Reset</button>
        </div>
        <MemoryGrid memory={pico.memory} />
      </div>
    )
  }
}