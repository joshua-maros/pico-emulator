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
  #memory = new Memory();

  #accumulator = new Reg('ACC');
  #programCounter = new Reg('PC');
  #irReg = new Reg('IR');
  #qReg = new Reg('Q');

  #carryFlag = new Flag('CARRY');
  #zeroFlag = new Flag('ZERO');
  #negFlag = new Flag('NEG');

  ////////////////////////////////////////////////////////////////////////
  // Helper functions
  ////////////////////////////////////////////////////////////////////////

  // 'val' is the offset portion of the instruction.  Verify that it is
  // a valid memory address.  Return true if not.
  IsBadOffset(op: string, val: number): boolean
  {
    if (val < 0 || val > 127)
    {
      this.lastError = op + ' address is missing or invalid';
      return true;
    }
    return false;
  }

  // 'addr' is an address into memory.  It should be pointing to an
  // integer value.  Fetch that value.  If the return value is ERR
  // (which is not a valid value), then the fetch failed (and an
  // error message was printed)
  FetchInt(op: string, addr: number): number
  {
    let mem = processor.finditem('mem');
    let data = mem.getvalue(addr);
    if (data === '?')
    {
      this.lastError = op + ' is addressing uninitialized memory';
      return ERR;
    }
    if (Number.isInteger(data) === false)
    {
      if (isNumeric(data))
      {
        data = parseInt(data, 10);
      }
      else
      {
        this.lastError = op + ' is addressing an instruction';
        return ERR;
      }
    }
    return data;
  }

  // 'addr' is an address into memory.  It should be pointing to an
  // integer value.  Fetch that value.  If the return value is ERR
  // (which is not a valid value), then the fetch failed (and an
  // error message was printed).  This is almost identical to the
  // previous function, but this is used to look up an indirect
  // address.  The error messages are slightly different in this version.
  FetchIndirect(op: string, addr: number)
  {
    let mem = processor.finditem('mem');
    mem.setredhighlight(addr);
    let data = mem.getvalue(addr);
    if (data === '?')
    {
      this.lastError = op + ' indirect pointer is not initialized';
      return ERR;
    }
    if (Number.isInteger(data) === false)
    {
      if (isNumeric(data))
      {
        data = parseInt(data, 10);
      }
      else
      {
        this.lastError = op + ' indirect pointer is an instruction';
        return ERR;
      }
    }
    return data;
  }

  // Get the accumulator's value as an integer.  Will return -4096
  // if there was an error fetching this value.
  FetchACC(op: string)
  {
    let acc = processor.finditem('acc');
    let a = acc.getvalue();
    if (a === '?')
    {
      this.lastError = op + ' ACC is not initialized';
      return ERR;
    }
    return a;
  }

  // Increment the PC (do a 'skip')
  IncPC()
  {
    let pc = processor.finditem('pc');
    let addr = pc.getvalue();
    pc.setvalue(addr + 1);
  }

  // Do the logic of a AND-type instructions
  DoAND(op: string, aval: number, mval: number)
  {
    let acc = processor.finditem('acc');
    let zeroFlag = processor.finditem('z');
    let result = aval & mval & 4095;
    if (result > 2047)
    {
      result -= 4096;
    }
    acc.setvalue(result);
    zeroFlag.setvalue(result === 0);
  }

  // Do the logic of a TAD-type instructions
  DoTAD(op: string, aval: number, mval: number)
  {
    let acc = processor.finditem('acc');
    let carryFlag = processor.finditem('c');
    let zeroFlag = processor.finditem('z');
    let negFlag = processor.finditem('n');
    let result = aval + mval;
    carryFlag.setvalue(false);
    if (result > 2047)
    {
      result -= 4096;
      carryFlag.setvalue(true);
    }
    else if (result < -2048)
    {
      result += 4096;
      carryFlag.setvalue(true);
    }
    acc.setvalue(result);
    zeroFlag.setvalue(result === 0);
    negFlag.setvalue(result < 0);
  }
}