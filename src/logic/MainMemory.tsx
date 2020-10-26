import React from 'react';
import { MemoryCell, CellUse } from '../utils/memory_cells';
import { Input, LogicComponent, Output } from "./component";
import { Datapath } from './datapath';

export class MainMemory extends LogicComponent
{
  // The names of the fields need to match the names given to the constructor.
  public addr: Input;
  public memr: Input;
  public memw: Input;
  public din: Input;
  public dout: Output;
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

    this.addr = new Input('addr', -20, params.addrY || 0);
    this.memr = new Input('memr', -20, params.memrY || 0);
    this.memw = new Input('memw', -20, params.memwY || 0);
    this.din = new Input('din', -20, params.dataY || 0);
    this.dout = new Output('dout', -20, (params.dataY || 0) - 20);
  }

  public eval()
  {
    this.dout.clear();
    const addr = this.addr.asInteger;
    if (addr === undefined) return;
    if (addr >= this.length || addr < 0)
    {
      throw new Error('there is no memory cell at address ' + addr);
    }
    let usage: CellUse = 'none';
    if (this.memr.asBoolean === true)
    {
      if (this.memw.asBoolean === true) return;
      usage = 'read';
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
    this.#cells[addr].lastUse = usage;
  }

  public evalClock()
  {
    const addr = this.addr.asInteger;
    if (addr === undefined) return;
    if (addr >= this.length || addr < 0)
    {
      throw new Error('there is no memory cell at address ' + addr);
    }
    if (this.memw.asBoolean === true && this.memr.asBoolean === false)
    {
      this.#cells[addr].lastUse = 'write';
      this.#cells[addr].value = this.din.value;
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
      </g>);
  }
};
