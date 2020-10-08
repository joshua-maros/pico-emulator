// src/utils/PicoMain.js - This is the starting screen for Pico
import PicoButton from './PicoButton';
import PicoV1 from './PicoV1';
import PicoV2 from './PicoV2';

// This function is the button handler.  It is passed the processor and
// the button ID.
const PicoMainButtonHandler = (processor, buttonID) =>
	{
    // Handle each type of button
    switch (buttonID)
    {
			case 1: // PDP8/e
        PicoV1(processor);
        processor.rebuild();
        break;
			case 2: // PDP8/e Datapath
        PicoV2(processor);
        processor.rebuild();
        break;
      default:
        break;
    }
	};

const PicoMain = (processor) =>
  {
    // Clear all the current elements in the Processor
    processor.clear_items();

    // Add the buttons to the Processor
		processor.add_item(new PicoButton(1, 'PDP8/e', 100, 40, 140, PicoMainButtonHandler.bind(this, processor, 1)));
		processor.add_item(new PicoButton(2, 'PDP8/e Datapath', 100, 65, 140, PicoMainButtonHandler.bind(this, processor, 2)));
  }

export default PicoMain;
