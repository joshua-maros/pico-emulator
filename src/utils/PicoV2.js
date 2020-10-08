// src/utils/PicoV2.js - PDP8/e Datapath
import PicoDatapath from './PicoDatapath';
import PDP8e from './PDP8e';

function PicoV2(processor)
{
  PicoDatapath(processor, PDP8e);
}

export default PicoV2;

/*
import DPControl from './DPControl';
import DPMux from './DPMux';
import DPProbe from './DPProbe';
import DPWire from './DPWire';
import DPLatch from './DPLatch';
import DPTristate from './DPTristate';
import PicoButton from './PicoButton';
import PicoMain from './PicoMain';
import DecoderLoader from './DecoderLoader';
import PicoFileLoad from './PicoFileLoad';
import PicoCSVWriter from './PicoCSVWriter';
import PicoSelect from './PicoSelect';

////////////////////////////////////////////////////////////////////////
// Helper functions
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
// This function executes the next instruction in the processor
function PicoV2Step(processor)
{
  // Get and clear the message
  let msg = processor.find_item('msg');
  msg.clear_message();

  // TBD
}

// Create the CSV data for the decoder
function PicoV2DecoderWriter(processor)
{
  let data = processor.decoder_to_csv();
  processor.set_csv_data(data);
  processor.rebuild();
}

let PicoV2Eval = (processor, full) =>
  {
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
    for (let i = 0 ; i < processor.items.length; i++)
    {
      let t = processor.items[i];
      if (t.eval)
      {
        t.eval();
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

  // This function is the button handler.  It is passed the processor and
  // the button ID.
  let PicoV2ButtonHandler = (processor, buttonID, ctrlName) =>
  	{
      // Handle each type of button
      switch (buttonID)
      {
        case 1: // Clock button
  				PicoV2Eval(processor, true);
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

const PicoV2 = (processor) =>
  {
    let handler = PicoV2ButtonHandler.bind(this, processor);
    let prebuild = PicoV2Eval.bind(this, processor, false);
    processor.set_prebuild(prebuild);

    processor.set_size(640, 550);

    // Clear all the current elements in the Processor
    processor.clear_items();

    processor.add_item(new DPControl(processor, 'ldpc', 1, 'ldpc', 100, 10, 100, handler, 101, 'ldpc', []));
    processor.add_item(new DPControl(processor, 'rdpc', 2, 'rdpc', 100, 40, 100, handler, 101, 'rdpc', []));
    processor.add_item(new DPControl(processor, 'sel', 3, 'sel', 100, 70, 100, handler, 101, 'sel', []));
    processor.add_item(new DPControl(processor, 'op', 4, 'op', 100, 110, 100, handler, 102, 'op',
      ['op:none', 'op:ADD', 'op:AND', 'op:CMP']));

    processor.add_item(new DPMux(processor, 'mux1', 5, 260, 10));
    processor.add_item(new DPLatch(processor, 'latch1', 11, 340, 25, 1));
    processor.add_item(new DPProbe(processor, 'probe1', 6, 520, 25, 80));
    processor.add_item(new DPTristate(processor, 'tristate1', 13, 430, 15, false));
    processor.add_item(new DPTristate(processor, 'tristate2', 14, 430, 100, false));
    processor.add_item(new DPControl(processor, 'tr1en', 15, 'tr1en', 310, 85, 80, handler, 101, 'tr1en', []));
    processor.add_item(new DPControl(processor, 'tr2en', 17, 'tr2en', 310, 140, 80, handler, 101, 'tr2en', []));

    processor.add_item(new DPWire(processor, 'wire1', 7));
    processor.find_item('wire1').pinToPin('ldpc', 'Out', 'mux1', 'In0', 'H');
    processor.add_item(new DPWire(processor, 'wire2', 8));
    processor.find_item('wire2').pinToPin('rdpc', 'Out', 'mux1', 'In1', 'H');
    processor.add_item(new DPWire(processor, 'wire3', 9));
    processor.find_item('wire3').pinToPin('sel', 'Out', 'mux1', 'Sel', 'HV');
    processor.add_item(new DPWire(processor, 'wire4', 10));
    processor.find_item('wire4').pinToPin('mux1', 'Out', 'latch1', 'In', 'H');
    processor.add_item(new DPWire(processor, 'wire5', 12));
    processor.find_item('wire5').pinToPin('latch1', 'Out', 'tristate1', 'In', 'H');
    processor.add_item(new DPWire(processor, 'wire6', 16));
    processor.find_item('wire6').pinToPin('tr1en', 'Out', 'tristate1', 'Enable', 'HV');
    processor.add_item(new DPWire(processor, 'wire7', 18));
    processor.find_item('wire7').pinToPin('tr2en', 'Out', 'tristate2', 'Enable', 'HV');
    processor.add_item(new DPWire(processor, 'wire8', 19));
    processor.find_item('wire8').pinToPin('op', 'Out', 'tristate2', 'In', 'H');
    processor.add_item(new DPWire(processor, 'wire9', 20));
    let wire = processor.find_item('wire9');
    wire.connectToGateOutput('tristate1', 'Out');
    wire.connectToGateOutput('tristate2', 'Out');
    wire.connectToGateInput('probe1', 'In');
    wire.addSegment(460, 35, 520, 35);
    wire.addSegment(460, 120, 490, 120);
    wire.addSegment(490, 120, 490, 35);

    processor.add_item(new PicoButton(1101, 'Clock', 100, 200, 100, PicoV2ButtonHandler.bind(this, processor, 1, '')));
    processor.add_item(new PicoButton(1106, 'End', 100, 325, 100, PicoV2ButtonHandler.bind(this, processor, 0, '')));

    processor.set_step(PicoV2Step.bind(this, processor));

    processor.add_opcodes([
      'AND', 'ANDI', 'ANDR', 'TAD', 'TADI', 'TADR', 'ISZ', 'ISZR',
      'DCA', 'DCAR', 'JMS', 'JMSR', 'JMP', 'JMPR', 'NOP', 'HLT',
      'IAC', 'RAL', 'RAR', 'CMA', 'CIA', 'CLA', 'STA', 'CLC', 'STC',
      'CMC', 'SKP', 'SCC', 'SCS', 'SZC', 'SZS', 'SNC', 'SNS',
      'MQA', 'MQL', 'SWP'
    ]);

    processor.add_cycles(['tFetch', 'tExecute', 'tDefer1', 'tDefer2']);

    processor.build_decoder();

    const loader = new DecoderLoader();
    processor.add_extra(new PicoFileLoad(107, 'Load Decoder:', processor, loader));
    processor.add_extra(new PicoCSVWriter(108, 'Save Decoder:', processor, PicoV2DecoderWriter.bind(processor)));
    processor.add_extra(new PicoSelect(109, 'Opcode:', processor.opcodes,
      function(processor)
      {
        return processor.curOpcode;
      }.bind(this, processor),
      function PicoV2SelectOpcode(processor, opcode)
      {
        processor.set_opcode(opcode);
      }.bind(this, processor)));
    processor.add_extra(new PicoSelect(110, 'Cycle:', processor.cycles,
      function(processor)
      {
        return processor.curCycle;
      }.bind(this, processor),
      function PicoV2SelectCycle(processor, cycle)
      {
        processor.set_cycle(cycle);
      }.bind(this, processor)));
    processor.add_extra(new PicoSelect(111, 'Next:', processor.cycles,
      function(processor)
      {
        return processor.cur_next();
      }.bind(this, processor),
      function PicoV2SelectNextCycle(processor, cycle)
      {
        processor.set_decoder_next(cycle);
      }.bind(this, processor)));
  }

export default PicoV2;
*/
