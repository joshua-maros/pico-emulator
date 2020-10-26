// This is the layout users should see if they don't want to look at the whole
// datapath and just want to prorgram the processor.

import React from 'react';
import MemoryGrid from './MemoryGrid';
import style from './ProgrammerLayout.module.css';
import MemoryCellView from './MemoryCellView';
import FlagCellView from './FlagCellView';
import { Datapath } from '../logic/datapath';
import { MemoryCell } from '../utils/memory_cells';

type Props = {
  datapath: Datapath
};

type State = {
  editing: {
    cell: MemoryCell,
    memoryIndex: number | undefined,
  }
  focusCell: (cell: MemoryCell, memoryIndex: number | undefined) => void,
}

export default class ProgrammerLayout extends React.Component<Props, State> {
  textBoxRef: React.RefObject<HTMLInputElement> = React.createRef();

  constructor(props: Props)
  {
    super(props);
    this.state = {
      editing: {
        cell: props.datapath.mainMemoryBlock[0],
        memoryIndex: 0,
      },
      focusCell: (cell: MemoryCell, memoryIndex: number | undefined) =>
      {
        this.setState(
          state =>
          {
            state.editing.cell = cell;
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

  selectTextBox()
  {
    this.textBoxRef.current?.focus();
    this.textBoxRef.current?.select();
  }

  shiftMemoryDown(at: number)
  {
    const mem = this.props.datapath.mainMemoryBlock;
    for (let targetIndex = mem.length - 1; targetIndex > at; targetIndex--)
    {
      mem[targetIndex].value = mem[targetIndex - 1].value;
    }
    mem[at].value = undefined;
    this.forceUpdate();
  }

  shiftMemoryUp(at: number)
  {
    const mem = this.props.datapath.mainMemoryBlock;
    for (let targetIndex = at; targetIndex < mem.length - 1; targetIndex++)
    {
      mem[targetIndex].value = mem[targetIndex + 1].value;
    }
    mem[mem.length - 1].value = undefined;
    this.forceUpdate();
  }

  render()
  {
    const datapath = this.props.datapath;
    let editingLabel = this.state.editing.cell.label;
    let isEditingMemory = this.state.editing.memoryIndex !== undefined;

    const changeValue = (event: React.ChangeEvent<HTMLInputElement>) =>
    {
      let value = event.target.value.toUpperCase();
      this.setState(
        state =>
        {
          if (value === '?')
            state.editing.cell.value = undefined;
          else
            state.editing.cell.value = value;
          this.props.datapath.eval();
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
          if (state.editing.memoryIndex === undefined) return state;
          if (state.editing.memoryIndex === 127) return state;
          state.editing.memoryIndex += 1;
          state.editing.cell = datapath.mainMemoryBlock[state.editing.memoryIndex];
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

    let sidebarItems = [];
    for (const reg of datapath.visibleRegisters)
    {
      sidebarItems.push((
        <div key={reg.label + '_label'} className={style.label}>{reg.label}</div>
      ));
      sidebarItems.push((
        <MemoryCellView
          key={reg.label + '_value'}
          cell={reg}
          onClick={() => this.state.focusCell(reg, undefined)}
          focused={reg === this.state.editing.cell}
        />
      ));
    }
    for (const flag of datapath.visibleFlags)
    {
      sidebarItems.push((
        <div key={flag.label + '_label'} className={style.label}>{flag.label}</div>
      ));
      sidebarItems.push((
        <FlagCellView key={flag.label + '_value'} flag={flag} />
      ));
    }

    const value = this.state.editing.cell.value;
    const fval = value === undefined ? '?' : value;

    return (
      <div className={style.processor}>
        <div className={style.left_controls}>
          {sidebarItems}

          <div />
          <div style={{ height: '2em' }} />

          <div className={style.label}>Selected:</div>
          <div>{editingLabel}</div>
          <div className={style.label}>Value:</div>
          <input
            ref={this.textBoxRef}
            value={fval}
            onChange={changeValue}
            onKeyUp={inputKeyUp}
          />

          <div />
          <button
            className="flat-button"
            onClick={() => this.shiftMemoryUp(this.state.editing.memoryIndex || 0)}
            disabled={!isEditingMemory}
          >Shift Up</button>
          <div />
          <button
            className="flat-button"
            onClick={() => this.shiftMemoryDown(this.state.editing.memoryIndex || 0)}
            disabled={!isEditingMemory}
          >Shift Down</button>

          <div />
          <div style={{ height: '2em' }} />

          <div />
          <div className={style.key}>
            <span className="use_read">Read</span>
            <span className="use_write">Written</span>
            <br />
            <span className="use_instruction">Instruction</span>
            <span className="use_jump_target">Jump Target</span>
            <br />
            <span className="use_address">Used As Address</span>
            <span className="use_error">Error</span>
          </div>
        </div>
        <MemoryGrid
          memoryBlock={datapath.mainMemoryBlock}
          onClick={index => this.state.focusCell(datapath.mainMemoryBlock[index], index)}
          focusedIndex={this.state.editing.memoryIndex}
        />
      </div>
    )
  }
}