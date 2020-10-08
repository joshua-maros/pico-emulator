// src/utils/PicoV1.js - PDP8/e
import PicoReg from './PicoReg';
import PicoFlag from './PicoFlag';
import PicoButton from './PicoButton';
import PicoMessage from './PicoMessage';
import PicoMain from './PicoMain';
import PicoFileLoad from './PicoFileLoad';
import PicoMemory from './PicoMemory';
import PicoValueEditor from './PicoValueEditor';
import PicoCSVWriter from './PicoCSVWriter';

const ERR = -4096;

function isNumeric(value)
{
    return /^-{0,1}\d+$/.test(value);
}

function PicoV1Reset(processor)
{
  processor.stop_running();
  let msg = processor.find_item('msg');
  msg.set_message('Processor is reset', false);
	let pc = processor.find_item('pc');
	pc.set_value(0);
	let ir = processor.find_item('ir');
	ir.set_value('?');
	let acc = processor.find_item('acc');
  acc.set_value('?');
	let q = processor.find_item('q');
  q.set_value('?');
	let carryFlag = processor.find_item('c');
  carryFlag.set_value(false);
	let zeroFlag = processor.find_item('z');
  zeroFlag.set_value(false);
	let negFlag = processor.find_item('n');
  negFlag.set_value(false);
}

// Create the CSV data for the main memory
function PicoV1MemWriter(processor, mem)
{
  let data = mem.to_csv();
  processor.set_csv_data(data);
  processor.rebuild();
}

////////////////////////////////////////////////////////////////////////
// Helper functions
////////////////////////////////////////////////////////////////////////

// 'val' is the offset portion of the instruction.  Verify that it is
// a valid memory address.  Return true if not.
function PicoV1_Is_Bad_Offset(processor, op, val)
{
  if (val < 0 || val > 127)
  {
    let msg = processor.find_item('msg');
    msg.set_message(op + ' address is missing or invalid', true);
    return true;
  }
  return false;
}

// 'addr' is an address into memory.  It should be pointing to an
// integer value.  Fetch that value.  If the return value is ERR
// (which is not a valid value), then the fetch failed (and an
// error message was printed)
function PicoV1_Fetch_Int(processor, op, addr)
{
  let mem = processor.find_item('mem');
  let data = mem.get_value(addr);
  if (data === '?')
  {
    let msg = processor.find_item('msg');
    msg.set_message(op + ' is addressing uninitialized memory', true);
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
      let msg = processor.find_item('msg');
      msg.set_message(op + ' is addressing an instruction', true);
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
function PicoV1_Fetch_Indirect(processor, op, addr)
{
  let mem = processor.find_item('mem');
  mem.set_red_highlight(addr);
  let data = mem.get_value(addr);
  if (data === '?')
  {
    let msg = processor.find_item('msg');
    msg.set_message(op + ' indirect pointer is not initialized', true);
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
      let msg = processor.find_item('msg');
      msg.set_message(op + ' indirect pointer is an instruction', true);
      return ERR;
    }
  }
  return data;
}

// Get the accumulator's value as an integer.  Will return -4096
// if there was an error fetching this value.
function PicoV1_Fetch_ACC(processor, op)
{
  let acc = processor.find_item('acc');
  let a = acc.get_value();
  if (a === '?')
  {
    let msg = processor.find_item('msg');
    msg.set_message('ACC is not initialized', true);
    return ERR;
  }
  return a;
}

// Increment the PC (do a 'skip')
function PicoV1_Inc_PC(processor)
{
  let pc = processor.find_item('pc');
  let addr = pc.get_value();
  pc.set_value(addr + 1);
}

// Do the logic of a AND-type instructions
function PicoV1_Do_AND(processor, op, aval, mval)
{
  let acc = processor.find_item('acc');
	let zeroFlag = processor.find_item('z');
  let result = aval & mval & 4095;
  if (result > 2047)
  {
    result -= 4096;
  }
  acc.set_value(result);
  zeroFlag.set_value(result === 0);
}

// Do the logic of a TAD-type instructions
function PicoV1_Do_TAD(processor, op, aval, mval)
{
  let acc = processor.find_item('acc');
  let carryFlag = processor.find_item('c');
	let zeroFlag = processor.find_item('z');
	let negFlag = processor.find_item('n');
  let result = aval + mval;
  carryFlag.set_value(false);
  if (result > 2047)
  {
    result -= 4096;
    carryFlag.set_value(true);
  }
  else if (result < -2048)
  {
    result += 4096;
    carryFlag.set_value(true);
  }
  acc.set_value(result);
  zeroFlag.set_value(result === 0);
  negFlag.set_value(result < 0);
}

////////////////////////////////////////////////////////////////////////
// Functions to implement the opcodes
////////////////////////////////////////////////////////////////////////

//----- AND

function PicoV1_AND(processor, op, val)
{
  if (PicoV1_Is_Bad_Offset(processor, op, val))
  {
    return;
  }
  let mem = processor.find_item('mem');
  mem.set_blue_highlight(val);
  let mval = PicoV1_Fetch_Int(processor, op, val);
  if (mval === ERR)
  {
    return;
  }
  let aval = PicoV1_Fetch_ACC(processor, op);
  if (aval === ERR)
  {
    return;
  }
  PicoV1_Do_AND(processor, op, aval, mval);
  let msg = processor.find_item('msg');
  msg.set_message('' + mval + ' from MEM[' + val + '] is ANDed to ACC', false);
}

//----- ANDI

function PicoV1_ANDI(processor, op, val)
{
  // Fetch the data based on the PC
  let pc = processor.find_item('pc');
  let addr = pc.get_value();
  pc.set_value(addr + 1);
  let mem = processor.find_item('mem');
  mem.set_blue_highlight(addr);
  let mval = PicoV1_Fetch_Int(processor, op, addr);
  if (mval === ERR)
  {
    return;
  }
  let aval = PicoV1_Fetch_ACC(processor, op);
  if (aval === ERR)
  {
    return;
  }
  PicoV1_Do_AND(processor, op, aval, mval);
  let msg = processor.find_item('msg');
  msg.set_message('' + mval + ' from MEM[' + addr + '] is ANDed to ACC', false);
}

//----- ANDR

function PicoV1_ANDR(processor, op, val)
{
  if (PicoV1_Is_Bad_Offset(processor, op, val))
  {
    return;
  }
  let addr = PicoV1_Fetch_Indirect(processor, op, val);
  if (addr === ERR)
  {
    return;
  }
  let mem = processor.find_item('mem');
  mem.set_blue_highlight(addr);
  let mval = PicoV1_Fetch_Int(processor, op, addr);
  if (mval === ERR)
  {
    return;
  }
  let aval = PicoV1_Fetch_ACC(processor, op);
  if (aval === ERR)
  {
    return;
  }
  PicoV1_Do_AND(processor, op, aval, mval);
  let msg = processor.find_item('msg');
  msg.set_message('' + mval + ' from MEM[' + addr + '] is added to ACC', false);
}

//----- TAD

function PicoV1_TAD(processor, op, val)
{
  if (PicoV1_Is_Bad_Offset(processor, op, val))
  {
    return;
  }
  let mem = processor.find_item('mem');
  mem.set_blue_highlight(val);
  let mval = PicoV1_Fetch_Int(processor, op, val);
  if (mval === ERR)
  {
    return;
  }
  let aval = PicoV1_Fetch_ACC(processor, op);
  if (aval === ERR)
  {
    return;
  }
  PicoV1_Do_TAD(processor, op, aval, mval);
  let msg = processor.find_item('msg');
  msg.set_message('' + mval + ' from MEM[' + val + '] is added to ACC', false);
}

//----- TADI

function PicoV1_TADI(processor, op, val)
{
  // Fetch the data based on the PC
  let pc = processor.find_item('pc');
  let addr = pc.get_value();
  pc.set_value(addr + 1);
  let mem = processor.find_item('mem');
  mem.set_blue_highlight(addr);
  let mval = PicoV1_Fetch_Int(processor, op, addr);
  if (mval === ERR)
  {
    return;
  }
  let aval = PicoV1_Fetch_ACC(processor, op);
  if (aval === ERR)
  {
    return;
  }
  PicoV1_Do_TAD(processor, op, aval, mval);
  let msg = processor.find_item('msg');
  msg.set_message('' + mval + ' from MEM[' + addr + '] is added to ACC', false);
}

//----- TADR

function PicoV1_TADR(processor, op, val)
{
  if (PicoV1_Is_Bad_Offset(processor, op, val))
  {
    return;
  }
  let addr = PicoV1_Fetch_Indirect(processor, op, val);
  if (addr === ERR)
  {
    return;
  }
  let mem = processor.find_item('mem');
  mem.set_blue_highlight(addr);
  let mval = PicoV1_Fetch_Int(processor, op, addr);
  if (mval === ERR)
  {
    return;
  }
  let aval = PicoV1_Fetch_ACC(processor, op);
  if (aval === ERR)
  {
    return;
  }
  PicoV1_Do_TAD(processor, op, aval, mval);
  let msg = processor.find_item('msg');
  msg.set_message('' + mval + ' from MEM[' + addr + '] is added to ACC', false);
}

//----- ISZ

function PicoV1_ISZ(processor, op, val)
{
  if (PicoV1_Is_Bad_Offset(processor, op, val))
  {
    return;
  }
  let mem = processor.find_item('mem');
  mem.set_blue_highlight(val);
  let mval = PicoV1_Fetch_Int(processor, op, val);
  if (mval === ERR)
  {
    return;
  }
  mval++;
  if (mval > 2047)
  {
    mval -= 4096;
  }
  mem.set_value(val, mval);
  let msg = processor.find_item('msg');
  if (mval === 0)
  {
    PicoV1_Inc_PC(processor);
    msg.set_message('The value at MEM[' + val + '] was incremented.  It is now zero so the next instruction is skipped', false);
  }
  else
  {
    msg.set_message('The value at MEM[' + val + '] was incremented.  It is not zero so the next instruction is not skipped', false);
  }
}

//----- ISZR

function PicoV1_ISZR(processor, op, val)
{
  if (PicoV1_Is_Bad_Offset(processor, op, val))
  {
    return;
  }
  let addr = PicoV1_Fetch_Indirect(processor, op, val);
  if (addr === ERR)
  {
    return;
  }
  let mem = processor.find_item('mem');
  mem.set_blue_highlight(addr);
  let mval = PicoV1_Fetch_Int(processor, op, addr);
  if (mval === ERR)
  {
    return;
  }
  mval++;
  if (mval > 2047)
  {
    mval -= 4096;
  }
  mem.set_value(addr, mval);
  let msg = processor.find_item('msg');
  if (mval === 0)
  {
    PicoV1_Inc_PC(processor);
    msg.set_message('The value at MEM[' + addr + '] was incremented.  It is now zero so the next instruction is skipped', false);
  }
  else
  {
    msg.set_message('The value at MEM[' + addr + '] was incremented.  It is not zero so the next instruction is not skipped', false);
  }
}

//----- DCA

function PicoV1_DCA(processor, op, val)
{
  if (PicoV1_Is_Bad_Offset(processor, op, val))
  {
    return;
  }
  let aval = PicoV1_Fetch_ACC(processor, op);
  if (aval === ERR)
  {
    return;
  }
  let mem = processor.find_item('mem');
  mem.set_value(val, aval);
  mem.set_blue_highlight(val);
  let acc = processor.find_item('acc');
  acc.set_value(0);
  let msg = processor.find_item('msg');
  msg.set_message('The value in ACC is stored to MEM[' + val +'], ACC is cleared', false);
}

//----- DCAR

function PicoV1_DCAR(processor, op, val)
{
  if (PicoV1_Is_Bad_Offset(processor, op, val))
  {
    return;
  }
  let addr = PicoV1_Fetch_Indirect(processor, op, val);
  if (addr === ERR)
  {
    return;
  }
  let aval = PicoV1_Fetch_ACC(processor, op);
  if (aval === ERR)
  {
    return;
  }
  let mem = processor.find_item('mem');
  mem.set_value(addr, aval);
  mem.set_blue_highlight(addr);
  let acc = processor.find_item('acc');
  acc.set_value(0);
  let msg = processor.find_item('msg');
  msg.set_message('The value in ACC is indirectly stored to MEM[' + addr +'], ACC is cleared', false);
}

//----- JMS

function PicoV1_JMS(processor, op, val)
{
  if (PicoV1_Is_Bad_Offset(processor, op, val))
  {
    return;
  }
  let mem = processor.find_item('mem');
  let pc = processor.find_item('pc');
  mem.set_value(val, pc.get_value());
  mem.set_red_highlight(val);
  pc.set_value(val + 1);
  mem.set_blue_highlight(val + 1);
  let msg = processor.find_item('msg');
  msg.set_message('The processor has jumped to subroutine at location ' + val, false);
}

//----- JMSR

function PicoV1_JMSR(processor, op, val)
{
  if (PicoV1_Is_Bad_Offset(processor, op, val))
  {
    return;
  }
  let addr = PicoV1_Fetch_Indirect(processor, op, val);
  if (addr === ERR)
  {
    return;
  }
  let mem = processor.find_item('mem');
  let pc = processor.find_item('pc');
  mem.set_value(addr, pc.get_value());
  mem.set_red_highlight(addr);
  pc.set_value(addr + 1);
  mem.set_blue_highlight(addr + 1);
  let msg = processor.find_item('msg');
  msg.set_message('The processor has indirectly jumped to subroutine at location ' + addr, false);
}

//----- JMP

function PicoV1_JMP(processor, op, val)
{
  if (PicoV1_Is_Bad_Offset(processor, op, val))
  {
    return;
  }
  let mem = processor.find_item('mem');
  let pc = processor.find_item('pc');
  pc.set_value(val);
  mem.set_blue_highlight(val);
  let msg = processor.find_item('msg');
  msg.set_message('The processor has jumped to location ' + val, false);
}

//----- JMPR

function PicoV1_JMPR(processor, op, val)
{
  if (PicoV1_Is_Bad_Offset(processor, op, val))
  {
    return;
  }
  let addr = PicoV1_Fetch_Indirect(processor, op, val);
  if (addr === ERR)
  {
    return;
  }
  let mem = processor.find_item('mem');
  let pc = processor.find_item('pc');
  pc.set_value(addr);
  mem.set_blue_highlight(addr);
  let msg = processor.find_item('msg');
  msg.set_message('The processor has indirectly jumped to location ' + addr, false);
}

//----- Conditional skip

function PicoV1_Cond_Skip(processor, flag, desired, name)
{
  let msg = processor.find_item('msg');
  if (flag === desired)
  {
    PicoV1_Inc_PC(processor);
    let val = (desired ? 'ON' : 'OFF');
    msg.set_message('The ' + name + ' flag is ' + val + ' so the next instruction is skipped', false);
  }
  else
  {
    let val = (desired ? 'OFF' : 'ON');
    msg.set_message('The ' + name + ' flag is ' + val + ' so the next instruction is not skipped', false);
  }
}

////////////////////////////////////////////////////////////////////////
// This function executes the next instruction in the processor
function PicoV1Step(processor)
{
  // Get and clear the message
  let msg = processor.find_item('msg');
  msg.clear_message();

	// Get the PC value, then increment the PC
	let pc = processor.find_item('pc');
	let addr = pc.get_value();
	pc.set_value(addr + 1);

	// Look up the instruction in memory, send to IR
	if (addr < 0 || addr > 127)
	{
		msg.set_message('PC addressed outside of memory', true);
		return;
	}
	let mem = processor.find_item('mem');
  mem.clear_highlights();
  mem.set_green_highlight(addr);
	let inst = mem.get_value(addr);
	let ir = processor.find_item('ir');
	ir.set_value(inst);
	if (inst === '?')
	{
		msg.set_message('PC is addressing uninitialized memory', true);
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

	let acc = processor.find_item('acc');
	let q = processor.find_item('q');
	let carryFlag = processor.find_item('c');
	let zeroFlag = processor.find_item('z');
	let negFlag = processor.find_item('n');
	let a;

	// Run the instructions with no memory addresses
	switch (op)
	{
    case 'AND':
      PicoV1_AND(processor, op, val);
      return;
    case 'ANDI':
      PicoV1_ANDI(processor, op, val);
      return;
    case 'ANDR':
      PicoV1_ANDR(processor, op, val);
      return;
    case 'TAD':
      PicoV1_TAD(processor, op, val);
      return;
    case 'TADI':
      PicoV1_TADI(processor, op, val);
      return;
    case 'TADR':
      PicoV1_TADR(processor, op, val);
      return;
    case 'ISZ':
      PicoV1_ISZ(processor, op, val);
      return;
    case 'ISZR':
      PicoV1_ISZR(processor, op, val);
      return;
    case 'DCA':
      PicoV1_DCA(processor, op, val);
      return;
    case 'DCAR':
      PicoV1_DCAR(processor, op, val);
      return;
    case 'JMS':
      PicoV1_JMS(processor, op, val);
      return;
    case 'JMSR':
      PicoV1_JMSR(processor, op, val);
      return;
    case 'JMP':
      PicoV1_JMP(processor, op, val);
      return;
    case 'JMPR':
      PicoV1_JMPR(processor, op, val);
      return;
		case 'NOP':
      msg.set_message('No operation is performed', false);
			return;
    case 'HLT':
      PicoV1Reset(processor);
      processor.halt();
      msg.set_message('The processor has halted', false);
      return;
		case 'CLA':
			acc.set_value(0);
      msg.set_message('ACC is cleared', false);
			return;
		case 'STA':
			acc.set_value(-1);
      msg.set_message('ACC is set to -1', false);
			return;
    case 'IAC':
      a = acc.get_value() + 1;
      carryFlag.set_value(false);
      if (a > 2047)
      {
        a -= 4096;
        carryFlag.set_value(true);
      }
      acc.set_value(a);
      zeroFlag.set_value(a === 0);
      negFlag.set_value(a < 0);
      msg.set_message('ACC incremented', false);
			return;
    case 'RAL':
      a = acc.get_value() & 4095;
      a = a << 1;
      if (carryFlag.get_value())
      {
        a = a + 1;
      }
      carryFlag.set_value((a & 4096) === 4096);
      a &= 4095;
      if (a > 2047)
      {
        a -= 4096;
      }
      acc.set_value(a);
      msg.set_message('ACC rotated left through carry', false);
			return;
    case 'RAR':
      a = acc.get_value() & 4095;
      if (carryFlag.get_value())
      {
        a = a + 4096;
      }
      carryFlag.set_value((a & 1) === 1);
      a = a >> 1;
      if (a > 2047)
      {
        a -= 4096;
      }
      acc.set_value(a);
      msg.set_message('ACC rotated right through carry', false);
			return;
    case 'CMA':
      a = acc.get_value();
      if (a === '?')
      {
        msg.set_message('ACC is not initialized', true);
        return;
      }
      a = ~a;
      if (a === 2048)
      {
        a = -2048;
      }
      acc.set_value(a);
      msg.set_message('ACC is complemented', false);
      return;
		case 'CIA':
			a = acc.get_value();
			if (a === '?')
			{
				msg.set_message('ACC is not initialized', true);
				return;
			}
			a = -a;
			if (a === 2048)
			{
				a = -2048;
			}
			acc.set_value(a);
      msg.set_message('ACC is negated', false);
			return;
    case 'CLC':
      carryFlag.set_value(false);
      msg.set_message('The Carry flag is cleared', false);
      return;
    case 'STC':
      carryFlag.set_value(true);
      msg.set_message('The Carry flag is set', false);
      return;
    case 'CMC':
      carryFlag.set_value(! carryFlag.get_value());
      msg.set_message('The Carry flag is toggled', false);
      return;
    case 'SKP':
      PicoV1_Inc_PC(processor);
      msg.set_message('The next instruction is skipped', false);
      return;
    case 'SCC':
      PicoV1_Cond_Skip(processor, carryFlag.get_value(), false, 'Carry');
      return;
    case 'SCS':
      PicoV1_Cond_Skip(processor, carryFlag.get_value(), true, 'Carry');
      return;
    case 'SZC':
      PicoV1_Cond_Skip(processor, zeroFlag.get_value(), false, 'Zero');
      return;
    case 'SZS':
      PicoV1_Cond_Skip(processor, zeroFlag.get_value(), true, 'Zero');
      return;
    case 'SNC':
      PicoV1_Cond_Skip(processor, negFlag.get_value(), false, 'Negative');
      return;
    case 'SNS':
      PicoV1_Cond_Skip(processor, negFlag.get_value(), true, 'Negative');
      return;
		case 'SWP':
			a = acc.get_value();
			acc.set_value(q.get_value());
			q.set_value(a);
      msg.set_message('The values in ACC and Q are swapped', false);
			return;
		case 'MQA':
			acc.set_value(q.get_value());
      msg.set_message('The value in Q is copied to ACC', false);
			return;
		case 'MQL':
			q.set_value(acc.get_value());
      msg.set_message('The value in ACC is copied to Q', false);
			return;
		default:
			break;
	}
}

// This function is the button handler.  It is passed the processor and
// the button ID.
const PicoV1ButtonHandler = (processor, buttonID) =>
	{
    // Handle each type of button
    switch (buttonID)
    {
      case 1: // Step button
				PicoV1Step(processor);
    		processor.rebuild();
        break;
      case 2: // Run button
        processor.start_running(false);
        break;
      case 3: // Run fast
        processor.start_running(true);
        break;
      case 4: // Stop
        processor.stop_running();
        break;
      case 5: // Reset button
        PicoV1Reset(processor);
        processor.rebuild();
        break;
      case 6: // End button
        PicoMain(processor);
        processor.rebuild();
        break;
      default:
        break;
    }
	};

const PicoV1 = (processor) =>
  {
    processor.set_size(640, 550);

    // Clear all the current elements in the Processor
    processor.clear_items();

    // Add the buttons to the Processor
    processor.add_item(new PicoReg(processor, 'pc', 1, 'PC', 100, 10));
		processor.add_item(new PicoReg(processor, 'acc', 2, 'ACC', 100, 35));
		processor.add_item(new PicoReg(processor, 'ir', 3, 'IR', 100, 60));
		processor.add_item(new PicoReg(processor, 'q', 4, 'Q', 100, 85));
		processor.add_item(new PicoFlag('c', 5, 'CARRY', 100, 110));
		processor.add_item(new PicoFlag('z', 6, 'ZERO', 100, 135));
		processor.add_item(new PicoFlag('n', 7, 'NEG', 100, 160));

		processor.add_item(new PicoMemory(processor, 'mem', 8, 'MEM', 300, 10, 128));

    processor.add_item(new PicoMessage('msg', 9, 10, 527, 610, null));

    processor.add_item(new PicoButton(101, 'Step', 100, 200, 100, PicoV1ButtonHandler.bind(this, processor, 1)));
    processor.add_item(new PicoButton(102, 'Run', 100, 225, 100, PicoV1ButtonHandler.bind(this, processor, 2)));
    processor.add_item(new PicoButton(103, 'Run Fast', 100, 250, 100, PicoV1ButtonHandler.bind(this, processor, 3)));
    processor.add_item(new PicoButton(104, 'Stop', 100, 275, 100, PicoV1ButtonHandler.bind(this, processor, 4)));
    processor.add_item(new PicoButton(105, 'Reset', 100, 300, 100, PicoV1ButtonHandler.bind(this, processor, 5)));
    processor.add_item(new PicoButton(106, 'End', 100, 325, 100, PicoV1ButtonHandler.bind(this, processor, 6)));

		let mem = processor.find_item('mem');

    processor.add_extra(new PicoValueEditor(201, processor), 0, 0);
    processor.add_extra(new PicoFileLoad(202, 'Load Mem Data:', processor, mem), 1, 0);
    processor.add_extra(new PicoCSVWriter(203, 'Save Mem Data:', 'memory.csv', processor, PicoV1MemWriter.bind(this, processor, mem)), 2, 0);

		let x = processor.find_item('pc');
		if (x) { x.set_value(0); }
		x = processor.find_item('acc');
		if (x) { x.set_value('?'); }
		x = processor.find_item('ir');
		if (x) { x.set_value('?'); }
		x = processor.find_item('q');
		if (x) { x.set_value('?'); }

    processor.set_step(PicoV1Step.bind(this, processor));
  }

export default PicoV1;
