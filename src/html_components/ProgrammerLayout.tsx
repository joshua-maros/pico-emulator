// This is the layout users should see if they don't want to look at the whole
// datapath and just want to prorgram the processor.

import React from 'react';
import MemoryGrid from './MemoryGrid';
import Pico from '../utils/PicoV3';
import style from './ProgrammerLayout.module.css';
import RegisterCell from './RegisterCell';
import FlagCell from './FlagCell';
import PicoReg from '../utils/PicoReg';
import csvio from '../utils/csvio';

type Props = {
  pico: Pico
};

type State = {
  editing: {
    register: PicoReg,
    memoryIndex: number | null,
  }
  focusRegister: (register: PicoReg, memoryIndex: number | null) => void,
}

export default class ProgrammerLayout extends React.Component<Props, State> {
  textBoxRef: React.RefObject<HTMLInputElement> = React.createRef();

  constructor(props: Props)
  {
    super(props);
    this.state = {
      editing: {
        register: props.pico.memory.get(0),
        memoryIndex: 0,
      },
      focusRegister: (register: PicoReg, memoryIndex: number | null) =>
      {
        this.setState(
          state =>
          {
            state.editing.register = register;
            state.editing.memoryIndex = memoryIndex;
            return state;
          },
          () =>
          {
            this.selectTextBox();
          }
        )
      }
    }
  }

  componentDidMount()
  {
    this.props.pico.onChange = () => this.forceUpdate();
  }

  componentWillUnmount()
  {
    this.props.pico.onChange = () => { };
  }

  selectTextBox()
  {
    this.textBoxRef.current?.focus();
    this.textBoxRef.current?.select();
  }

  render()
  {
    let pico = this.props.pico;
    let editingLabel = this.state.editing.register.label;
    let editingMemoryCell = this.state.editing.memoryIndex !== null;

    const makeRegisterCell = (register: PicoReg) =>
    {
      return (<RegisterCell
        reg={register}
        onClick={() => this.state.focusRegister(register, null)}
        focused={register === this.state.editing.register}
      />);
    };

    const changeValue = (event: React.ChangeEvent<HTMLInputElement>) =>
    {
      let value = event.target.value.toUpperCase();
      this.setState(
        state =>
        {
          state.editing.register.value = value;
          return state;
        }
      );
    };

    // Moves to the next memory cell if possible.
    const advanceEditor = () =>
    {
      this.setState(
        state =>
        {
          if (state.editing.memoryIndex === null) return state;
          if (state.editing.memoryIndex === 127) return state;
          state.editing.memoryIndex += 1;
          state.editing.register = pico.memory.get(state.editing.memoryIndex);
          return state;
        },
        () =>
        {
          // Do this after the state is set because updating the state will
          // mess with the text box.
          this.selectTextBox();
        }
      );
    };

    const inputKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) =>
    {
      if (event.key === 'Enter')
      {
        advanceEditor();
      }
    }

    const loadFile = (event: React.ChangeEvent<HTMLInputElement>) =>
    {
      let file = event.target.files?.item(0);
      if (!file) return;
      file.text().then((text: string) =>
      {
        let error = csvio.loadMem(pico.memory, text);
        this.forceUpdate();
        if (error)
        {
          alert('Error encountered while loading file:\n' + error);
        }
      });
    };

    const saveFile = () => 
    {
      let contents = csvio.saveMem(pico.memory);
      let blob = new Blob([contents]);
      let href = URL.createObjectURL(blob);
      let link = document.createElement('a');
      link.download = 'Memory.csv';
      link.type = 'text/csv';
      link.href = href;
      link.click();
      link.remove();
    }

    return (
      <div className={style.root}>
        <div className={style.processor}>
          <div className={style.left_controls}>
            <div className={style.label}>PC</div>
            {makeRegisterCell(pico.programCounter)}
            <div className={style.label}>ACC</div>
            {makeRegisterCell(pico.accumulator)}
            <div className={style.label}>IR</div>
            {makeRegisterCell(pico.instructionRegister)}
            <div className={style.label}>Q</div>
            {makeRegisterCell(pico.qReg)}

            <div className={style.label}>CARRY</div>
            <FlagCell flag={pico.carryFlag} />
            <div className={style.label}>ZERO</div>
            <FlagCell flag={pico.zeroFlag} />
            <div className={style.label}>NEG</div>
            <FlagCell flag={pico.negFlag} />

            <div />
            <div style={{ height: '2em' }} />

            <div className={style.label}>Selected:</div>
            <div>{editingLabel}</div>
            <div className={style.label}>Value:</div>
            <input
              ref={this.textBoxRef}
              value={this.state.editing.register.value}
              onChange={changeValue}
              onKeyUp={inputKeyUp}
            />

            <div />
            <button
              className="flat-button"
              onClick={() => { pico.memory.shiftUp(this.state.editing.memoryIndex || 0); this.forceUpdate() }}
              disabled={!editingMemoryCell}
            >Shift Up</button>
            <div />
            <button
              className="flat-button"
              onClick={() => { pico.memory.shiftDown(this.state.editing.memoryIndex || 0); this.forceUpdate() }}
              disabled={!editingMemoryCell}
            >Shift Down</button>
          </div>
          <MemoryGrid
            memory={pico.memory}
            onClick={index => this.state.focusRegister(pico.memory.get(index), index)}
            focusedIndex={this.state.editing.memoryIndex}
          />
        </div>
        <div className={pico.lastMessageWasError ? style.error_message : style.info_message}>
          {pico.lastMessage}
        </div>
        <div className={style.actions}>
          <button className="flat-button" onClick={() => pico.step()}>Step</button>
          <button className="flat-button" onClick={() => pico.startRunning(false)}>Run</button>
          <button className="flat-button" onClick={() => pico.startRunning(true)}>Run Fast</button>
          <button className="flat-button" onClick={() => pico.halt()}>Stop</button>
          <button className="flat-button" onClick={() => pico.reset()}>Reset</button>
          <button className="flat-button" onClick={saveFile}>Save Memory</button>
          <label className="flat-button" htmlFor="file">Load Memory</label>
          <input onChange={loadFile} id="file" type="file" accept=".csv" className={style.semi_hidden} />
          <button className={'flat-button ' + style.switch_view_button}>Switch To Datapath View</button>
        </div>
      </div>
    )
  }
}