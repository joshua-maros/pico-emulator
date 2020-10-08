// src/utils/PicoDatapath.js - Datapath engine
import DPControl from './DPControl';
import DPMux from './DPMux';
import DPALU from './DPALU';
import DPFlagLogic from './DPFlagLogic';
import DPDecoder from './DPDecoder';
import DPAnd from './DPAnd';
import DPOr from './DPOr';
import DPAndOr from './DPAndOr';
import DPProbe from './DPProbe';
import DPWire from './DPWire';
import DPLatch from './DPLatch';
import DPIncrementer from './DPIncrementer';
import DPTristate from './DPTristate';
import DPExpand from './DPExpand';
import DPMainMemory from './DPMainMemory';
import PicoButton from './PicoButton';
import PicoMessage from './PicoMessage';
import PicoMain from './PicoMain';
import DecoderLoader from './DecoderLoader';
import PicoFileLoad from './PicoFileLoad';
import PicoCSVWriter from './PicoCSVWriter';
import PicoSelect from './PicoSelect';
import PicoValueEditor from './PicoValueEditor';

////////////////////////////////////////////////////////////////////////
// Helper functions
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
// This function executes the next instruction in the processor
function PicoDatapathStep(processor)
{
  // Get and clear the message
  //let msg = processor.find_item('msg');
  //msg.clear_message();

  // TBD
}

// Create the CSV data for the decoder
function PicoDatapathDecoderWriter(processor)
{
  let data = processor.decoder_to_csv();
  processor.set_csv_data(data);
  processor.rebuild();
}

// Create the CSV data for the main memory
function PicoDatapathMemWriter(processor, mem)
{
  let data = mem.to_csv();
  processor.set_csv_data(data);
  processor.rebuild();
}

// Run a simulation of the datapath.
let PicoDatapathEval = (processor, full) =>
  {
    if (processor.has_errors())
    {
      return;
    }

    // First do the begin_eval for all components
    for (let i = 0 ; i < processor.items.length; i++)
    {
      let t = processor.items[i];
      if (t.begin_eval)
      {
        t.begin_eval();
      }
    }

    // Now do an eval of all the components
    for (let j = 0; j < 10; j++)
    {
    for (let i = 0 ; i < processor.items.length; i++)
    {
      let t = processor.items[i];
      if (t.eval)
      {
        t.eval();
      }
    }
    }

    // Finally do an end_eval of all the components, if we are doing the
    // full step.
    if (full)
    {
      for (let i = 0 ; i < processor.items.length; i++)
      {
        let t = processor.items[i];
        if (t.end_eval)
        {
          t.end_eval();
        }
      }
    }
  };

// Run a simulation of the datapath.
let PicoDatapathReset = (processor) =>
  {
    if (processor.has_errors())
    {
      return;
    }

    for (let i = 0 ; i < processor.items.length; i++)
    {
      let t = processor.items[i];
      if (t.reset)
      {
        t.reset();
      }
    }
  };

// This function is the button handler.  It is passed the processor and
// the button ID.
let PicoDatapathButtonHandler = (processor, buttonID, ctrlName) =>
	{
    // Handle each type of button
    let nextCycle;
    switch (buttonID)
    {
      case 1: // Clock button
        nextCycle = processor.cur_next();
				PicoDatapathEval(processor, true);
        processor.set_cycle(nextCycle); // This did the rebuild
        break;
      case 2: // Reset button
				PicoDatapathReset(processor);
    		processor.rebuild();
        break;
      case 0: // End button
        PicoMain(processor);
        processor.rebuild();
        break;
      case 101:
        processor.toggle_dp_control(ctrlName);
        processor.rebuild();
        break;
      case 102:
        processor.inc_dp_control(ctrlName);
        processor.rebuild();
        break;
      default:
        break;
    }
	};

function PicoDatapath(processor, design)
{
  // Set the size of the SVG
  processor.set_size(design.size.wid, design.size.hgt);

  // Get the button handler for the DPControl callbacks (and the GUI buttons)
  let handler = PicoDatapathButtonHandler.bind(this, processor);

  // Set the callback functions
  let prebuild = PicoDatapathEval.bind(this, processor, false);
  processor.set_prebuild(prebuild);
  processor.set_step(PicoDatapathStep.bind(this, processor));

  // Clear all the current elements in the Processor
  processor.clear_items();

  // Build all of the items
  let mem = null;
  for (let i = 0; i < design.items.length; i++)
  {
    const item = design.items[i];
    switch (item.type)
    {
      case 'DPControl':
        processor.add_item(new DPControl(processor, item.id, i + 1,
            item.label, item.x, item.y, item.wid, item.top, handler,
            (item.options.length === 0) ? 101 : 102,
            item.name, item.options));
        break;
      case 'DPMux':
        processor.add_item(new DPMux(processor, item.id, i + 1, item.x, item.y));
        break;
      case 'DPALU':
        processor.add_item(new DPALU(processor, item.id, i + 1, item.x, item.y, item.nBits));
        break;
      case 'DPFlagLogic':
        processor.add_item(new DPFlagLogic(processor, item.id, i + 1, item.x, item.y));
        break;
      case 'DPDecoder':
        processor.add_item(new DPDecoder(processor, item.id, i + 1, item.x, item.y));
        break;
      case 'DPExpand':
        processor.add_item(new DPExpand(processor, item.id, i + 1, item.x, item.y, item.inNBits, item.outNBits, item.extend));
        break;
      case 'DPAnd':
        processor.add_item(new DPAnd(processor, item.id, i + 1, item.x, item.y));
        break;
      case 'DPOr':
        processor.add_item(new DPOr(processor, item.id, i + 1, item.x, item.y));
        break;
      case 'DPAndOr':
        processor.add_item(new DPAndOr(processor, item.id, i + 1, item.x, item.y));
        break;
      case 'DPLatch':
        processor.add_item(new DPLatch(processor, item.id, i + 1, item.label, item.x, item.y, item.nbits, item.powerOnReset, item.isIR));
        break;
      case 'DPIncrementer':
        processor.add_item(new DPIncrementer(processor, item.id, i + 1, item.x, item.y, item.nbits, item.constant));
        break;
      case 'DPProbe':
        processor.add_item(new DPProbe(processor, item.id, i + 1, item.x, item.y, item.wid));
        break;
      case 'DPTristate':
        processor.add_item(new DPTristate(processor, item.id, i + 1, item.x, item.y, item.flip));
        break;
      case 'DPMainMemory':
        mem = new DPMainMemory(processor, item.id, i + 1, item.label,
          item.x, item.y, item.databits, item.addrbits, item.addrY, item.memrY,
          item.memwY, item.dataY);
        processor.add_item(mem);
        break;
      case 'DPWire':
        processor.add_item(new DPWire(processor, item.id, i + 1, item.label, item.x, item.y));
        let wire = processor.find_item(item.id);
        if (wire !== null)
        {
          wire.add_inputs(item.inputs);
          wire.add_outputs(item.outputs);
          wire.set_path(item.path);
        }
        break;
      default:
        break;
    }
  }

  // Set the opcodes and the cycles, then build the decoder:
  processor.add_opcodes(design.opcodes);
  processor.add_cycles(design.cycles);
  processor.build_decoder();

  // Add the GUI
  const hgt = design.size.hgt - 22;
  processor.add_item(new PicoButton(1101, 'Clock', 10, hgt, 100, PicoDatapathButtonHandler.bind(this, processor, 1, '')));
  processor.add_item(new PicoButton(1102, 'Reset', 120, hgt, 100, PicoDatapathButtonHandler.bind(this, processor, 2, '')));
  processor.add_item(new PicoButton(1106, 'End', 230, hgt, 100, PicoDatapathButtonHandler.bind(this, processor, 0, '')));
  processor.add_item(new PicoMessage(1107, 'Status', 340, hgt, 300, processor.statusMessage));

  const loader = new DecoderLoader();
  processor.add_extra(new PicoValueEditor(113, processor), 3, 0);
  processor.add_extra(new PicoSelect(109, 'Opcode:', processor.opcodes,
    function(processor)
    {
      return processor.curOpcode;
    }.bind(this, processor),
    function(processor, opcode)
    {
      processor.set_opcode(opcode);
    }.bind(this, processor)), 0, 0);
  processor.add_extra(new PicoSelect(110, 'Cycle:', processor.cycles,
    function(processor)
    {
      return processor.curCycle;
    }.bind(this, processor),
    function(processor, cycle)
    {
      processor.set_cycle(cycle);
    }.bind(this, processor)), 1, 0);
  processor.add_extra(new PicoSelect(111, 'Next:', processor.cycles,
    function(processor)
    {
      return processor.cur_next();
    }.bind(this, processor),
    function(processor, cycle)
    {
      processor.set_decoder_next(cycle);
    }.bind(this, processor)), 2, 0);
  if (mem)
  {
    processor.add_extra(new PicoFileLoad(112, 'Load Mem Data:', processor, mem), 0, 1);
    processor.add_extra(new PicoCSVWriter(105, 'Save Mem Data:', 'memory.csv', processor, PicoDatapathMemWriter.bind(this, processor, mem)), 1, 1);
  }
  processor.add_extra(new PicoFileLoad(107, 'Load Decoder:', processor, loader), 2, 1);
  processor.add_extra(new PicoCSVWriter(108, 'Save Decoder:', 'decoder.csv', processor, PicoDatapathDecoderWriter.bind(processor)), 3, 1);
};

export default PicoDatapath;
