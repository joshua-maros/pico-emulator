/* eslint no-throw-literal: "off" */

import Flag from './PicoFlag';
import Memory from './PicoMemory';
import Processor from './Processor';
import Reg from './PicoReg';
import PicoReg from './PicoReg';
import PicoFlag from './PicoFlag';

function isNumeric(value: string): boolean
{
  return /^-{0,1}\d+$/.test(value);
}

export default class Pico extends Processor
{
  #memory = new Memory(128);

  #accumulator = new Reg('ACC');
  #programCounter = new Reg('PC');
  #instructionRegister = new Reg('IR');
  #qReg = new Reg('Q');

  #carryFlag = new Flag('CARRY');
  #zeroFlag = new Flag('ZERO');
  #negFlag = new Flag('NEG');

  get memory(): Memory { return this.#memory; }

  get accumulator(): PicoReg { return this.#accumulator; }
  get programCounter(): PicoReg { return this.#programCounter; }
  get instructionRegister(): PicoReg { return this.#instructionRegister; }
  get qReg(): PicoReg { return this.#qReg; }

  get carryFlag(): PicoFlag { return this.#carryFlag; }
  get zeroFlag(): PicoFlag { return this.#zeroFlag; }
  get negFlag(): PicoFlag { return this.#negFlag; }

  constructor()
  {
    super();
    this.doReset();
  }

  protected doReset()
  {
    this.#programCounter.valueAsNumber = 0;
    this.clearLastUse();
  }

  ////////////////////////////////////////////////////////////////////////
  // Helper functions
  ////////////////////////////////////////////////////////////////////////

  // 'val' is the offset portion of the instruction.  Verify that it is
  // a valid memory address.  Throws an error if it is not.
  private checkOkOffset(val: number)
  {
    if (val < 0 || val > 127)
    {
      throw 'address is missing or invalid';
    }
  }

  // 'addr' is an address into memory.  It should be pointing to an
  // integer value.  Fetch that value.  Throws an error if one was encountered.
  private fetchInt(addr: number): number
  {
    let cell = this.#memory.get(addr);
    cell.lastUse = 'read';
    let data = cell.value;
    if (data === '?')
    {
      cell.lastUse = 'error';
      throw 'addressing uninitialized memory at ' + addr;
    }
    if (isNumeric(data))
    {
      return parseInt(data, 10);
    }
    else
    {
      cell.lastUse = 'error';
      throw 'expected a number while addressing ' + addr
      + ' but found an instruction instead';
    }
  }

  // 'addr' is an address into memory.  It should be pointing to an
  // integer value.  Fetch that value.  This is almost identical to the
  // previous function, but this is used to look up an indirect
  // address.  Throws an error if one is encountered.
  private fetchIndirect(addr: number): number
  {
    let cell = this.#memory.get(addr);
    cell.lastUse = 'read';
    let data = cell.value;
    if (data === '?')
    {
      cell.lastUse = 'error';
      throw 'indirectly addressing uninitialized memory at ' + addr;
    }
    if (isNumeric(data))
    {
      return parseInt(data, 10);
    }
    else
    {
      cell.lastUse = 'error';
      throw 'expected a number while indirectly addressing ' + addr
      + ' but found an instruction instead';
    }
  }

  // Get the accumulator's value as an integer.  Throws an error if one is
  // encountered.
  private fetchACC(): number
  {
    this.#accumulator.lastUse = 'read';
    return this.#accumulator.valueAsNumber;
  }

  // Increment the PC (do a 'skip')
  private incPC()
  {
    this.#programCounter.valueAsNumber += 1;
  }

  // Do the logic of a AND-type instructions
  private andHelper(aval: number, mval: number)
  {
    let result = aval & mval & 4095;
    if (result > 2047)
    {
      result -= 4096;
    }
    this.#accumulator.lastUse = 'write';
    this.#accumulator.value = '' + result;
    this.#zeroFlag.value = result === 0;
  }

  // Do the logic of a TAD-type instructions
  private tadHelper(aval: number, mval: number)
  {
    let result = aval + mval;
    this.#carryFlag.value = false;
    if (result > 2047)
    {
      result -= 4096;
      this.#carryFlag.value = true;
    }
    else if (result < -2048)
    {
      result += 4096;
      this.#carryFlag.value = true;
    }
    this.#accumulator.lastUse = 'write';
    this.#accumulator.value = '' + result;
    this.#zeroFlag.value = result === 0;
    this.#negFlag.value = result < 0;
  }

  ////////////////////////////////////////////////////////////////////////
  // Functions to implement the opcodes
  ////////////////////////////////////////////////////////////////////////

  //----- AND

  private doAND(val: number): string
  {
    this.checkOkOffset(val);
    let mval = this.fetchInt(val);
    let aval = this.fetchACC();
    this.andHelper(aval, mval);
    return '' + mval + ' from MEM[' + val + '] is ANDed to ACC';
  }

  //----- ANDI

  private doANDI(_val: number): string
  {
    // Fetch the data based on the PC
    let addr = this.#programCounter.valueAsNumber;
    this.incPC();
    let mval = this.fetchInt(addr);
    let aval = this.fetchACC();
    this.andHelper(aval, mval);
    return '' + mval + ' from MEM[' + addr + '] is ANDed to ACC';
  }

  //----- ANDR

  private doANDR(val: number): string
  {
    this.checkOkOffset(val);
    let addr = this.fetchIndirect(val);
    let mval = this.fetchInt(addr);
    let aval = this.fetchACC();
    this.andHelper(aval, mval);
    return '' + mval + ' from MEM[' + addr + '] is added to ACC';
  }

  //----- TAD

  private doTAD(val: number): string
  {
    this.checkOkOffset(val);
    let mval = this.fetchInt(val);
    let aval = this.fetchACC();
    this.tadHelper(aval, mval);
    return '' + mval + ' from MEM[' + val + '] is added to ACC';
  }

  //----- TADI

  private doTADI(val: number): string
  {
    // Fetch the data based on the PC
    let addr = this.#programCounter.valueAsNumber;
    this.incPC();
    let mval = this.fetchInt(addr);
    let aval = this.fetchACC();
    this.tadHelper(aval, mval);
    return '' + mval + ' from MEM[' + addr + '] is added to ACC';
  }

  //----- TADR

  private doTADR(val: number): string
  {
    this.checkOkOffset(val);
    let addr = this.fetchIndirect(val);
    let mval = this.fetchInt(addr);
    let aval = this.fetchACC();
    this.tadHelper(aval, mval);
    return '' + mval + ' from MEM[' + addr + '] is added to ACC';
  }

  //----- ISZ

  private doISZ(val: number): string
  {
    this.checkOkOffset(val);
    let mval = this.fetchInt(val);
    mval++;
    if (mval > 2047)
    {
      mval -= 4096;
    }
    let cell = this.#memory.get(val);
    cell.valueAsNumber = mval;
    cell.lastUse = 'write';
    if (mval === 0)
    {
      this.incPC();
      return 'The value at MEM[' + val + '] was incremented.  It is now zero so the next instruction is skipped';
    }
    else
    {
      return 'The value at MEM[' + val + '] was incremented.  It is not zero so the next instruction is not skipped';
    }
  }

  //----- ISZR

  private doISZR(val: number): string
  {
    this.checkOkOffset(val);
    let addr = this.fetchIndirect(val);
    let mval = this.fetchInt(addr);
    mval++;
    if (mval > 2047)
    {
      mval -= 4096;
    }
    let cell = this.#memory.get(val);
    cell.valueAsNumber = mval;
    cell.lastUse = 'write';
    if (mval === 0)
    {
      this.incPC();
      return 'The value at MEM[' + addr + '] was incremented.  It is now zero so the next instruction is skipped';
    }
    else
    {
      return 'The value at MEM[' + addr + '] was incremented.  It is not zero so the next instruction is not skipped';
    }
  }

  //----- DCA

  private doDCA(val: number): string
  {
    this.checkOkOffset(val);
    let aval = this.fetchACC();
    this.#memory.get(val).valueAsNumber = aval;
    let cell = this.#memory.get(val);
    cell.valueAsNumber = aval;
    cell.lastUse = 'write';
    this.#accumulator.valueAsNumber = 0;
    return 'The value in ACC is stored to MEM[' + val + '], ACC is cleared';
  }

  //----- DCAR

  private doDCAR(val: number): string
  {
    this.checkOkOffset(val);
    let addr = this.fetchIndirect(val);
    let aval = this.fetchACC();
    let cell = this.#memory.get(val);
    cell.valueAsNumber = aval;
    cell.lastUse = 'write';
    this.#accumulator.valueAsNumber = 0;
    return 'The value in ACC is indirectly stored to MEM[' + addr + '], ACC is cleared';
  }

  //----- JMS

  private doJMS(val: number): string
  {
    this.checkOkOffset(val);
    this.#memory.get(val).value = this.#programCounter.value;
    this.#memory.get(val).lastUse = 'write';
    this.#programCounter.valueAsNumber = val + 1;
    this.#memory.get(val + 1).lastUse = 'jump_target';
    return 'The processor has jumped to subroutine at location ' + val;
  }

  //----- JMSR

  private doJMSR(val: number): string
  {
    this.checkOkOffset(val);
    let addr = this.fetchIndirect(val);
    this.#memory.get(addr).value = this.#programCounter.value;
    this.#memory.get(addr).lastUse = 'write'
    this.#programCounter.valueAsNumber = addr + 1;
    this.#memory.get(addr + 1).lastUse = 'jump_target';
    return 'The processor has indirectly jumped to subroutine at location ' + addr;
  }

  //----- JMP

  private doJMP(val: number): string
  {
    this.checkOkOffset(val);
    this.#programCounter.valueAsNumber = val;
    this.#memory.get(val).lastUse = 'jump_target';
    return 'The processor has jumped to location ' + val;
  }

  //----- JMPR

  private doJMPR(val: number): string
  {
    this.checkOkOffset(val);
    let addr = this.fetchIndirect(val);
    this.#programCounter.valueAsNumber = addr;
    this.#memory.get(val).lastUse = 'read';
    this.#memory.get(addr).lastUse = 'jump_target';
    return 'The processor has indirectly jumped to location ' + addr;
  }

  //----- Conditional skip

  private doCondSkip(flag: boolean, desired: boolean, name: string): string
  {
    if (flag === desired)
    {
      this.#memory.get(this.#programCounter.valueAsNumber).lastUse = 'error';
      this.incPC();
      this.#memory.get(this.#programCounter.valueAsNumber).lastUse = 'jump_target';
      let val = (desired ? 'ON' : 'OFF');
      return 'The ' + name + ' flag is ' + val + ' so the next instruction is skipped';
    }
    else
    {
      this.#memory.get(this.#programCounter.valueAsNumber).lastUse = 'jump_target';
      let val = (desired ? 'OFF' : 'ON');
      return 'The ' + name + ' flag is ' + val + ' so the next instruction is not skipped';
    }
  }

  private doInstruction(opcode: string, immediate: number): string
  {
    let value;
    // Run the instructions with no memory addresses
    switch (opcode)
    {
      case 'AND':
        return this.doAND(immediate);
      case 'ANDI':
        return this.doANDI(immediate);
      case 'ANDR':
        return this.doANDR(immediate);
      case 'TAD':
        return this.doTAD(immediate);
      case 'TADI':
        return this.doTADI(immediate);
      case 'TADR':
        return this.doTADR(immediate);
      case 'ISZ':
        return this.doISZ(immediate);
      case 'ISZR':
        return this.doISZR(immediate);
      case 'DCA':
        return this.doDCA(immediate);
      case 'DCAR':
        return this.doDCAR(immediate);
      case 'JMS':
        return this.doJMS(immediate);
      case 'JMSR':
        return this.doJMSR(immediate);
      case 'JMP':
        return this.doJMP(immediate);
      case 'JMPR':
        return this.doJMPR(immediate);
      case 'NOP':
        return 'No operation is performed';
      case 'HLT':
        this.halt();
        return 'The processor has halted';
      case 'CLA':
        this.#accumulator.valueAsNumber = 0;
        this.#accumulator.lastUse = 'write';
        return 'ACC is cleared';
      case 'STA':
        this.#accumulator.valueAsNumber = -1;
        this.#accumulator.lastUse = 'write';
        return 'ACC is set to -1';
      case 'IAC':
        value = this.fetchACC() + 1;
        this.#carryFlag.value = false;
        if (value > 2047)
        {
          value -= 4096;
          this.#carryFlag.value = true;
        }
        this.#accumulator.valueAsNumber = value;
        this.#accumulator.lastUse = 'write';
        this.#zeroFlag.value = value === 0;
        this.#negFlag.value = value < 0;
        return 'ACC incremented';
      case 'RAL':
        value = this.fetchACC() & 4095;
        value = value << 1;
        if (this.#carryFlag.value)
        {
          value += 1;
        }
        this.#carryFlag.value = (value & 4096) === 4096;
        value &= 4095;
        if (value > 2047)
        {
          value -= 4096;
        }
        this.#accumulator.valueAsNumber = value;
        this.#accumulator.lastUse = 'write';
        return 'ACC rotated left through carry';
      case 'RAR':
        value = this.fetchACC() & 4095;
        if (this.#carryFlag.value)
        {
          value = value + 4096;
        }
        this.#carryFlag.value = (value & 1) === 1;
        value = value >> 1;
        if (value > 2047)
        {
          value -= 4096;
        }
        this.#accumulator.valueAsNumber = value;
        this.#accumulator.lastUse = 'write';
        return 'ACC rotated right through carry';
      case 'CMA':
        value = this.fetchACC();
        value = ~value;
        if (value === 2048)
        {
          value = -2048;
        }
        this.#accumulator.valueAsNumber = value;
        this.#accumulator.lastUse = 'write';
        return 'ACC is complemented';
      case 'CIA':
        value = this.fetchACC();
        value = -value;
        if (value === 2048)
        {
          value = -2048;
        }
        this.#accumulator.valueAsNumber = value;
        this.#accumulator.lastUse = 'write';
        return 'ACC is negated';
      case 'CLC':
        this.#carryFlag.value = false;
        return 'The Carry flag is cleared';
      case 'STC':
        this.#carryFlag.value = true;
        return 'The Carry flag is set';
      case 'CMC':
        this.#carryFlag.value = !this.#carryFlag.value;
        return 'The Carry flag is toggled';
      case 'SKP':
        this.incPC();
        return 'The next instruction is skipped';
      case 'SCC':
        return this.doCondSkip(this.#carryFlag.value, false, 'Carry');
      case 'SCS':
        return this.doCondSkip(this.#carryFlag.value, true, 'Carry');
      case 'SZC':
        return this.doCondSkip(this.#zeroFlag.value, false, 'Zero');
      case 'SZS':
        return this.doCondSkip(this.#zeroFlag.value, true, 'Zero');
      case 'SNC':
        return this.doCondSkip(this.#negFlag.value, false, 'Negative');
      case 'SNS':
        return this.doCondSkip(this.#negFlag.value, true, 'Negative');
      case 'SWP':
        value = this.#accumulator.value;
        this.#accumulator.value = this.#qReg.value;
        this.#qReg.value = value;
        this.#accumulator.lastUse = 'write';
        this.#qReg.lastUse = 'write';
        return 'The values in ACC and Q are swapped';
      case 'MQA':
        this.#accumulator.value = this.#qReg.value;
        this.#accumulator.lastUse = 'write';
        this.#qReg.lastUse = 'read';
        return 'The value in Q is copied to ACC';
      case 'MQL':
        this.#qReg.value = this.#accumulator.value;
        this.#accumulator.lastUse = 'read';
        this.#qReg.lastUse = 'write';
        return 'The value in ACC is copied to Q';
      default:
        throw 'Invalid instruction ' + opcode;
    }
  }

  private clearLastUse()
  {
    this.#memory.clearLastUse();
    this.#programCounter.clearLastUse();
    this.#accumulator.clearLastUse();
    this.#instructionRegister.clearLastUse();
    this.#qReg.clearLastUse();
  }

  protected doStep(): string
  {
    this.clearLastUse();

    // Get the PC value, then increment the PC
    let addr = this.#programCounter.valueAsNumber;
    this.incPC();

    // Look up the instruction in memory, send to IR
    if (addr < 0 || addr > 127)
    {
      throw 'PC addressed outside of memory';
    }
    this.#memory.get(addr).lastUse = 'instruction';
    let inst = this.#memory.get(addr).value;
    this.#instructionRegister.value = inst;
    if (inst === '?')
    {
      throw 'PC is addressing uninitialized memory';
    }

    // Split the instruction into opcode and address.  The address
    // will be -1 if the opcode had no address.
    let arr = inst.split(' ');
    let op = arr[0];
    let val = -1;
    if (arr.length > 1)
    {
      val = parseInt(arr[1], 10);
    }

    try
    {
      return this.doInstruction(op, val);
    }
    catch (error)
    {
      throw 'Error while performing "' + op + '" instruction: ' + error;
    }
  }
}