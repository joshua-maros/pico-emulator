// src/utils/DPMux.js - A multiplexer for the datapath view
import React from 'react';
import MuxView from '../components/MuxView';

class DPMux
{
	constructor(processor, id, key, x, y)
	{
    this.processor = processor;
		this.id = id;
    this.key = key;
    this.x = x;
    this.y = y;

		// We do not yet have the connections
    this.connectIn0 = null;
    this.connectIn1 = null;
    this.connectSel = null;
		this.connectOut = null;
	};

	// Add a connection
	connectToPin(connector, pinName)
	{
    if (pinName === 'In0')
		{
			this.connectIn0 = connector;
			connector.set_location(this.x, this.y + 10);
			return;
		}
    if (pinName === 'In1')
		{
			this.connectIn1 = connector;
			connector.set_location(this.x, this.y + 40);
			return;
		}
    if (pinName === 'Sel')
		{
			this.connectSel = connector;
			connector.set_location(this.x + 10, this.y + 45);
			return;
		}
		if (pinName === 'Out')
		{
			this.connectOut = connector;
			connector.set_location(this.x + 20, this.y + 25);
			return;
		}
		this.processor.add_error('A DPMux gate does not have a pin named ' + pinName);
	}

	// We don't do anything to begin the eval of a control.
	begin_eval()
	{
		// EMPTY
	}

	// Evaluate this gate:
	eval()
	{
        // Only eval if this is connected.
        if (this.connectIn0 === null || this.connectIn1 === null
            || this.connectSel === null || this.connectOut === null)
        {
            return;
        }
        const sel = this.connectSel.use_value();
        if (sel === 'Conflict' || sel === 'Unknown')
        {
            this.connectOut.set_value('Unknown');
            return;
        }
        if (sel === true)
        {
            this.connectOut.set_value(this.connectIn1.get_value());
            if (this.connectOut.is_used())
            {
                this.connectIn1.use_value();
            }
            return;
        }
        if (sel === false)
        {
            this.connectOut.set_value(this.connectIn0.get_value());
            if (this.connectOut.is_used())
            {
                this.connectIn0.use_value();
            }
            return;
        }
        this.processor.add_error('Evaluating DPMux ' + this.id + ': Sel input has value ' + sel);
	}

	// We don't do anything to end the eval of a control.
	end_eval()
	{
		// EMPTY
	}

  // Build the implementation of the control (a MuxView component)
  implement()
  {
    return ( <MuxView
                x={this.x}
                y={this.y}
                key={this.key}
              />);
  }
};

export default DPMux;
