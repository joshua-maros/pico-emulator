// src/utils/DPAnd.js - An AND gate for the datapath view
import React from 'react';
import AndView from '../components/AndView';

class DPAnd
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
		this.connectOut = null;
	};

	// Add a connection
	connectToPin(connector, pinName)
	{
    if (pinName === 'In0')
		{
			this.connectIn0 = connector;
			connector.set_location(this.x, this.y + 5);
			return;
		}
    if (pinName === 'In1')
		{
			this.connectIn1 = connector;
			connector.set_location(this.x, this.y + 15);
			return;
		}
		if (pinName === 'Out')
		{
			this.connectOut = connector;
			connector.set_location(this.x + 20, this.y + 10);
			return;
		}
		this.processor.add_error('A DPAnd gate does not have a pin named ' + pinName);
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
      || this.connectOut === null)
    {
      return;
    }
    const in0 = this.connectIn0.use_value();
    const in1 = this.connectIn1.use_value();
    if (in1 === true && in0 === true)
    {
      this.connectOut.set_value(true);
      return;
    }
    if (in1 === false || in0 === false)
    {
      this.connectOut.set_value(false);
      return;
    }
    this.connectOut.set_value('Unknown');
	}

	// We don't do anything to end the eval of a control.
	end_eval()
	{
		// EMPTY
	}

  // Build the implementation of the control (a MuxView component)
  implement()
  {
    return ( <AndView
                x={this.x}
                y={this.y}
                key={this.key}
              />);
  }
};

export default DPAnd;
