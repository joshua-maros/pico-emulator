import Flag from './PicoFlag';
import Memory from './PicoMemory';
import Processor from './Processor';
import Reg from './PicoReg';

const ERR = -4096;

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

  ////////////////////////////////////////////////////////////////////////
  // Helper functions
  ////////////////////////////////////////////////////////////////////////

  // 'val' is the offset portion of the instruction.  Verify that it is
  // a valid memory address.  Return true if not.
  isBadOffset(op: string, val: number): boolean
  {
    if (val < 0 || val > 127)
    {
      this.setMessage(op + ' address is missing or invalid', true);
      return true;
    }
    return false;
  }

  // 'addr' is an address into memory.  It should be pointing to an
  // integer value.  Fetch that value.  If the return value is ERR
  // (which is not a valid value), then the fetch failed (and an
  // error message was printed)
  fetchInt(op: string, addr: number): number
  {
    let data = this.#memory.getValue(addr);
    if (data === '?')
    {
      this.setMessage(op + ' is addressing uninitialized memory', true);
      return ERR;
    }
    if (isNumeric(data))
    {
      return parseInt(data, 10);
    }
    this.setMessage(op + ' is addressing an instruction', true);
    return ERR;
  }

  // 'addr' is an address into memory.  It should be pointing to an
  // integer value.  Fetch that value.  If the return value is ERR
  // (which is not a valid value), then the fetch failed (and an
  // error message was printed).  This is almost identical to the
  // previous function, but this is used to look up an indirect
  // address.  The error messages are slightly different in this version.
  fetchIndirect(op: string, addr: number): number
  {
    // this.#memory.setredhighlight(addr);
    let data = this.#memory.getValue(addr);
    if (data === '?')
    {
      this.setMessage(op + ' indirect pointer is not initialized', true);
      return ERR;
    }
    if (isNumeric(data))
    {
      return parseInt(data, 10);
    }
    else
    {
      this.setMessage(op + ' indirect pointer is an instruction', true);
      return ERR;
    }
  }

  // Get the accumulator's value as an integer.  Will return -4096
  // if there was an error fetching this value.
  fetchACC(op: string): number
  {
    let a = this.#accumulator.value;
    if (a === '?')
    {
      this.setMessage(op + ' ACC is not initialized', true);
      return ERR;
    }
    return this.#accumulator.valueAsNumber;
  }

  // Increment the PC (do a 'skip')
  incPC()
  {
    this.#programCounter.valueAsNumber += 1;
  }

  // Do the logic of a AND-type instructions
  andHelper(_op: string, aval: number, mval: number)
  {
    let result = aval & mval & 4095;
    if (result > 2047)
    {
      result -= 4096;
    }
    this.#accumulator.value = '' + result;
    this.#zeroFlag.value = result == 0;
  }

  // Do the logic of a TAD-type instructions
  tadHelper(_op: string, aval: number, mval: number)
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
    this.#accumulator.value = '' + result;
    this.#zeroFlag.value = result === 0;
    this.#negFlag.value = result < 0;
  }

  ////////////////////////////////////////////////////////////////////////
  // Functions to implement the opcodes
  ////////////////////////////////////////////////////////////////////////

  //----- AND

  doAND(op: string, val: number)
  {
    if (this.isBadOffset(op, val))
    {
      return;
    }
    // this.#memory.set_blue_highlight(val);
    let mval = this.fetchInt(op, val);
    if (mval === ERR)
    {
      return;
    }
    let aval = this.fetchACC(op);
    if (aval === ERR)
    {
      return;
    }
    this.andHelper(op, aval, mval);
    this.setMessage('' + mval + ' from MEM[' + val + '] is ANDed to ACC', false);
  }

  //----- ANDI

  doANDI(op: string, val: number)
  {
    // Fetch the data based on the PC
    let addr = this.#programCounter.valueAsNumber;
    this.incPC();
    // mem.set_blue_highlight(addr);
    let mval = this.fetchInt(op, addr);
    if (mval === ERR)
    {
      return;
    }
    let aval = this.fetchACC(op);
    if (aval === ERR)
    {
      return;
    }
    this.andHelper(op, aval, mval);
    this.setMessage('' + mval + ' from MEM[' + addr + '] is ANDed to ACC', false);
  }

  //----- ANDR

  doANDR(op: string, val: number)
  {
    if (this.isBadOffset(op, val))
    {
      return;
    }
    let addr = this.fetchIndirect(op, val);
    if (addr === ERR)
    {
      return;
    }
    // this.#memory.set_blue_highlight(addr);
    let mval = this.fetchInt(op, addr);
    if (mval === ERR)
    {
      return;
    }
    let aval = this.fetchACC(op);
    if (aval === ERR)
    {
      return;
    }
    this.andHelper(op, aval, mval);
    this.setMessage('' + mval + ' from MEM[' + addr + '] is added to ACC', false);
  }

  //----- TAD

  doTAD(op: string, val: number)
  {
    if (this.isBadOffset(op, val))
    {
      return;
    }
    // this.#memory.set_blue_highlight(val);
    let mval = this.fetchInt(op, val);
    if (mval === ERR)
    {
      return;
    }
    let aval = this.fetchACC(op);
    if (aval === ERR)
    {
      return;
    }
    this.tadHelper(op, aval, mval);
    this.setMessage('' + mval + ' from MEM[' + val + '] is added to ACC', false);
  }

  //----- TADI

  doTADI(op: string, val: number)
  {
    // Fetch the data based on the PC
    let addr = this.#programCounter.valueAsNumber;
    this.incPC();
    // this.#memory.set_blue_highlight(addr);
    let mval = this.fetchInt(op, addr);
    if (mval === ERR)
    {
      return;
    }
    let aval = this.fetchACC(op);
    if (aval === ERR)
    {
      return;
    }
    this.tadHelper(op, aval, mval);
    this.setMessage('' + mval + ' from MEM[' + addr + '] is added to ACC', false);
  }

  //----- TADR

  doTADR(op: string, val: number)
  {
    if (this.isBadOffset(op, val))
    {
      return;
    }
    let addr = this.fetchIndirect(op, val);
    if (addr === ERR)
    {
      return;
    }
    // this.#memory.set_blue_highlight(addr);
    let mval = this.fetchInt(op, addr);
    if (mval === ERR)
    {
      return;
    }
    let aval = this.fetchACC(op);
    if (aval === ERR)
    {
      return;
    }
    this.tadHelper(op, aval, mval);
    this.setMessage('' + mval + ' from MEM[' + addr + '] is added to ACC', false);
  }

  //----- ISZ

  doISZ(op: string, val: number)
  {
    if (this.isBadOffset(op, val))
    {
      return;
    }
    // this.#memory.set_blue_highlight(val);
    let mval = this.fetchInt(op, val);
    if (mval === ERR)
    {
      return;
    }
    mval++;
    if (mval > 2047)
    {
      mval -= 4096;
    }
    this.#memory.setValue(val, '' + mval);
    if (mval === 0)
    {
      this.incPC();
      this.setMessage('The value at MEM[' + val + '] was incremented.  It is now zero so the next instruction is skipped', false);
    }
    else
    {
      this.setMessage('The value at MEM[' + val + '] was incremented.  It is not zero so the next instruction is not skipped', false);
    }
  }

  //----- ISZR

  doISZR(op: string, val: number)
  {
    if (this.isBadOffset(op, val))
    {
      return;
    }
    let addr = this.fetchIndirect(op, val);
    if (addr === ERR)
    {
      return;
    }
    // this.#memory.set_blue_highlight(addr);
    let mval = this.fetchInt(op, addr);
    if (mval === ERR)
    {
      return;
    }
    mval++;
    if (mval > 2047)
    {
      mval -= 4096;
    }
    this.#memory.setValue(addr, '' + mval);
    if (mval === 0)
    {
      this.incPC();
      this.setMessage('The value at MEM[' + addr + '] was incremented.  It is now zero so the next instruction is skipped', false);
    }
    else
    {
      this.setMessage('The value at MEM[' + addr + '] was incremented.  It is not zero so the next instruction is not skipped', false);
    }
  }

  //----- DCA

  doDCA(op: string, val: number)
  {
    if (this.isBadOffset(op, val))
    {
      return;
    }
    let aval = this.fetchACC(op);
    if (aval === ERR)
    {
      return;
    }
    this.#memory.setValue(val, '' + aval);
    // this.#memory.set_blue_highlight(val);
    this.#accumulator.valueAsNumber = 0;
    this.setMessage('The value in ACC is stored to MEM[' + val + '], ACC is cleared', false);
  }

  //----- DCAR

  doDCAR(op: string, val: number)
  {
    if (this.isBadOffset(op, val))
    {
      return;
    }
    let addr = this.fetchIndirect(op, val);
    if (addr === ERR)
    {
      return;
    }
    let aval = this.fetchACC(op);
    if (aval === ERR)
    {
      return;
    }
    this.#memory.setValue(addr, '' + aval);
    // this.#memory.set_blue_highlight(addr);
    // acc.set_value(0);
    this.setMessage('The value in ACC is indirectly stored to MEM[' + addr + '], ACC is cleared', false);
  }

  //----- JMS

  doJMS(op: string, val: number)
  {
    if (this.isBadOffset(op, val))
    {
      return;
    }
    this.#memory.setValue(val, this.#programCounter.value);
    // this.#memory.set_red_highlight(val);
    this.#programCounter.valueAsNumber = val + 1;
    this.setMessage('The processor has jumped to subroutine at location ' + val, false);
  }

  //----- JMSR

  doJMSR(op: string, val: number)
  {
    if (this.isBadOffset(op, val))
    {
      return;
    }
    let addr = this.fetchIndirect(op, val);
    if (addr === ERR)
    {
      return;
    }
    this.#memory.setValue(addr, this.#programCounter.value);
    // this.#memory.set_red_highlight(addr);
    this.#programCounter.valueAsNumber = addr + 1;
    // this.#memory.set_blue_highlight(addr + 1);
    this.setMessage('The processor has indirectly jumped to subroutine at location ' + addr, false);
  }

  //----- JMP

  doJMP(op: string, val: number)
  {
    if (this.isBadOffset(op, val))
    {
      return;
    }
    this.#programCounter.valueAsNumber = val;
    // mem.set_blue_highlight(val);
    this.setMessage('The processor has jumped to location ' + val, false);
  }

  //----- JMPR

  doJMPR(op: string, val: number)
  {
    if (this.isBadOffset(op, val))
    {
      return;
    }
    let addr = this.fetchIndirect(op, val);
    if (addr === ERR)
    {
      return;
    }
    this.#programCounter.valueAsNumber = addr;
    // this.#memory.set_blue_highlight(addr);
    this.setMessage('The processor has indirectly jumped to location ' + addr, false);
  }

  //----- Conditional skip

  doCondSkip(flag: boolean, desired: boolean, name: string)
  {
    if (flag === desired)
    {
      this.incPC();
      let val = (desired ? 'ON' : 'OFF');
      this.setMessage('The ' + name + ' flag is ' + val + ' so the next instruction is skipped', false);
    }
    else
    {
      let val = (desired ? 'OFF' : 'ON');
      this.setMessage('The ' + name + ' flag is ' + val + ' so the next instruction is not skipped', false);
    }
  }

  step()
  {
    // Get the PC value, then increment the PC
    let addr = this.#programCounter.valueAsNumber;
    this.incPC();

    // Look up the instruction in memory, send to IR
    if (addr < 0 || addr > 127)
    {
      this.setMessage('PC addressed outside of memory', true);
      return;
    }
    // this.#memory.clear_highlights();
    // this.#memory.set_green_highlight(addr);
    let inst = this.#memory.getValue(addr);
    this.#instructionRegister.value = inst;
    if (inst === '?')
    {
      this.setMessage('PC is addressing uninitialized memory', true);
      return;
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

    let value;

    // Run the instructions with no memory addresses
    switch (op)
    {
      case 'AND':
        this.doAND(op, val);
        return;
      case 'ANDI':
        this.doANDI(op, val);
        return;
      case 'ANDR':
        this.doANDR(op, val);
        return;
      case 'TAD':
        this.doTAD(op, val);
        return;
      case 'TADI':
        this.doTADI(op, val);
        return;
      case 'TADR':
        this.doTADR(op, val);
        return;
      case 'ISZ':
        this.doISZ(op, val);
        return;
      case 'ISZR':
        this.doISZR(op, val);
        return;
      case 'DCA':
        this.doDCA(op, val);
        return;
      case 'DCAR':
        this.doDCAR(op, val);
        return;
      case 'JMS':
        this.doJMS(op, val);
        return;
      case 'JMSR':
        this.doJMSR(op, val);
        return;
      case 'JMP':
        this.doJMP(op, val);
        return;
      case 'JMPR':
        this.doJMPR(op, val);
        return;
      case 'NOP':
        this.setMessage('No operation is performed', false);
        return;
      case 'HLT':
        this.halt();
        this.setMessage('The processor has halted', false);
        return;
      case 'CLA':
        this.#accumulator.valueAsNumber = 0;
        this.setMessage('ACC is cleared', false);
        return;
      case 'STA':
        this.#accumulator.valueAsNumber = -1;
        this.setMessage('ACC is set to -1', false);
        return;
      case 'IAC':
        value = this.#accumulator.valueAsNumber + 1;
        this.#carryFlag.value = false;
        if (value > 2047)
        {
          value -= 4096;
          this.#carryFlag.value = true;
        }
        this.#accumulator.valueAsNumber = value;
        this.#zeroFlag.value = value === 0;
        this.#negFlag.value = value < 0;
        this.setMessage('ACC incremented', false);
        return;
      case 'RAL':
        value = this.#accumulator.valueAsNumber & 4095;
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
        this.setMessage('ACC rotated left through carry', false);
        return;
      case 'RAR':
        value = this.#accumulator.valueAsNumber & 4095;
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
        this.setMessage('ACC rotated right through carry', false);
        return;
      case 'CMA':
        value = this.#accumulator.valueAsNumber;
        value = ~value;
        if (value === 2048)
        {
          value = -2048;
        }
        this.#accumulator.valueAsNumber = value;
        this.setMessage('ACC is complemented', false);
        return;
      case 'CIA':
        value = this.#accumulator.valueAsNumber;
        value = -value;
        if (value === 2048)
        {
          value = -2048;
        }
        this.#accumulator.valueAsNumber = value;
        this.setMessage('ACC is negated', false);
        return;
      case 'CLC':
        this.#carryFlag.value = false;
        this.setMessage('The Carry flag is cleared', false);
        return;
      case 'STC':
        this.#carryFlag.value = true;
        this.setMessage('The Carry flag is set', false);
        return;
      case 'CMC':
        this.#carryFlag.value = !this.#carryFlag.value;
        this.setMessage('The Carry flag is toggled', false);
        return;
      case 'SKP':
        this.incPC();
        this.setMessage('The next instruction is skipped', false);
        return;
      case 'SCC':
        this.doCondSkip(this.#carryFlag.value, false, 'Carry');
        return;
      case 'SCS':
        this.doCondSkip(this.#carryFlag.value, true, 'Carry');
        return;
      case 'SZC':
        this.doCondSkip(this.#zeroFlag.value, false, 'Zero');
        return;
      case 'SZS':
        this.doCondSkip(this.#zeroFlag.value, true, 'Zero');
        return;
      case 'SNC':
        this.doCondSkip(this.#negFlag.value, false, 'Negative');
        return;
      case 'SNS':
        this.doCondSkip(this.#negFlag.value, true, 'Negative');
        return;
      case 'SWP':
        value = this.#accumulator.value;
        this.#accumulator.value = this.#qReg.value;
        this.#qReg.value = value;
        this.setMessage('The values in ACC and Q are swapped', false);
        return;
      case 'MQA':
        this.#accumulator.value = this.#qReg.value;
        this.setMessage('The value in Q is copied to ACC', false);
        return;
      case 'MQL':
        this.#qReg.value = this.#accumulator.value;
        this.setMessage('The value in ACC is copied to Q', false);
        return;
      default:
        break;
    }
  }
}