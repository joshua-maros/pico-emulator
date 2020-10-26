import React from 'react';
import { MemoryCell, CellUse } from '../utils/memory_cells';
import { ComponentUsageError, Input, LogicComponent, Output } from "./component";
import { Datapath } from './datapath';

export class MainMemory extends LogicComponent
{
  // The names of the fields need to match the names given to the constructor.
  public addr: Input;
  public memr: Input;
  public memw: Input;
  public din: Input;
  public dout: Output;
  // Use these to highlight a memory address with what it was used for.
  public highlight_instr = new Input("highlight_instr", 0, 400);
  public highlight_jumpt = new Input("highlight_jumpt", 0, 425);
  public highlight_addr = new Input("highlight_addr", 0, 450);
  public readonly addrbits: number;
  public readonly databits: number;
  public readonly length: number;
  #cells: Array<MemoryCell>;

  constructor(d: Datapath, id: string, x: number, y: number, params: any)
  {
    super(d, "MainMemory", id, x, y);
    this.addrbits = params.addrbits;
    this.databits = params.databits;
    this.length = 1 << this.addrbits;
    this.#cells = [];
    for (let i = 0; i < this.length; i++)
    {
      this.#cells.push(new MemoryCell(`Memory Cell ${i}`));
    }
    d.mainMemoryBlock = this.#cells;

    this.addr = new Input('addr', 0, params.addrY || 0);
    this.memr = new Input('memr', 0, params.memrY || 0);
    this.memw = new Input('memw', 0, params.memwY || 0);
    this.din = new Input('din', 0, params.dataY || 0);
    this.dout = new Output('dout', 0, (params.dataY || 0) - 20);
  }

  public eval()
  {
    this.dout.clear();
    const addr = this.addr.asInteger;
    if (addr === undefined) return;
    if (addr >= this.length || addr < 0)
    {
      throw new ComponentUsageError('there is no memory cell at address ' + addr);
    }
    if (this.memr.asBoolean === true)
    {
      if (this.memw.asBoolean === true) return;
      this.dout.value = this.#cells[addr].value;
      this.addr.used = true;
      this.memr.used = true;
    }
    else if (this.memw.asBoolean === true)
    {
      this.addr.used = true;
      this.din.used = true;
      this.memw.used = true;
    }
    if (this.highlight_instr.asBoolean === true) this.highlight_instr.used = true;
    if (this.highlight_jumpt.asBoolean === true) this.highlight_jumpt.used = true;
    if (this.highlight_addr.asBoolean === true) this.highlight_addr.used = true;
    if (
      this.highlight_instr.asBoolean === true
      || this.highlight_jumpt.asBoolean === true
      || this.highlight_addr.asBoolean === true
    )
    {
      this.addr.used = true;
    }
  }

  public evalClock()
  {
    const addr = this.addr.asInteger;
    if (addr === undefined) return;
    if (addr >= this.length || addr < 0)
    {
      throw new ComponentUsageError('There is no memory cell at address ' + addr);
    }
    let usage: CellUse = 'none';
    if (this.memw.asBoolean === false && this.memr.asBoolean === true)
    {
      usage = 'read';
    }
    else if (this.memw.asBoolean === true && this.memr.asBoolean === false)
    {
      usage = 'write';
      this.#cells[addr].value = this.din.value;
    }
    if (usage === 'read' && this.dout.value === undefined)
    {
      usage = 'error';
    }
    else
    {
      if (this.highlight_instr.asBoolean === true) usage = 'instruction';
      if (this.highlight_jumpt.asBoolean === true) usage = 'jump_target';
      if (this.highlight_addr.asBoolean === true) usage = 'address';
    }
    this.#cells[addr].lastUse = usage;
    if (usage === 'error')
    {
      throw new ComponentUsageError('Cannot read from uninitialized memory at address ' + addr);
    }
  }

  public clearHighlights()
  {
    for (const cell of this.#cells)
    {
      cell.lastUse = 'none';
    }
  }

  public render(k: string, d: Datapath)
  {
    return (<MainMemoryView key={k} c={this} d={d} />)
  }
}

class MainMemoryView extends React.Component<{ c: MainMemory, d: Datapath }>
{
  render()
  {
    const { x, y } = this.props.c;
    const xfrm = 'translate(' + x + ',' + y + ')';
    return (
      <g transform={xfrm} className="component">
        <rect x={0} y={0} width={30} height={500} />
        <text className="label" x={10} y={250} textAnchor="middle" transform="rotate(90, 10, 250)">Main Memory</text>
      </g>);
  }
};
