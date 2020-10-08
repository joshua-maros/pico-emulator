// src/utils/DPDecoder.js - The instruction Decoder for the datapath view
import React from 'react';
import DecoderView from '../components/DecoderView';

class DPDecoder
{
	constructor(processor, id, key, x, y)
	{
    this.processor = processor;
		this.id = id;
    this.key = key;
    this.x = x;
    this.y = y;

		// We do not yet have the connection
    this.connectIn = null;
	};

	// Add a connection
	connectToPin(connector, pinName)
	{
    if (pinName === 'In')
		{
			this.connectIn = connector;
			connector.set_location(this.x, this.y + 15);
			return;
		}
		this.processor.add_error('A DPDecoder gate does not have a pin named ' + pinName);
	}

	// We don't do anything to begin the eval of a control.
	begin_eval()
	{
		// EMPTY
	}

	// We don't do anything to evaluate this gate:
	eval()
	{
        if (this.connectIn !== null)
        {
            this.connectIn.use_value();
        }
	}

	// We don't do anything to end the eval this gate.
	end_eval()
	{
		// EMPTY
	}

  // Build the implementation of the control (a MuxView component)
  implement()
  {
		const processor = this.processor;
		const status = processor.curOpcode + '/' + processor.curCycle + ' > ' + processor.cur_next();
    return ( <DecoderView
                x={this.x}
                y={this.y}
                key={this.key}
								status={status}
              />);
  }
};

export default DPDecoder;
