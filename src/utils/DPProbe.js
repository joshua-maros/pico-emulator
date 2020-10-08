// src/utils/DPProbe.js - A probe for the datapath view
import React from 'react';
import ProbeView from '../components/ProbeView';

class DPProbe
{
	constructor(processor, id, key, x, y, wid)
	{
    this.processor = processor;
		this.id = id;
    this.key = key;
    this.x = x;
    this.y = y;
    this.wid = wid;

		// We do not yet have the connections
    this.connectIn = null;

    // During simulation, the 'value' of the probe
    this.value = '';
	};

	// Add a connection
	connectToPin(connector, pinName)
	{
    if (pinName === 'In')
		{
			this.connectIn = connector;
			connector.set_location(this.x, this.y + 10);
			return;
		}
		this.processor.add_error('A DPProbe gate does not have a pin named ' + pinName);
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
    if (this.connectIn === null)
    {
      return;
    }
    this.value = this.connectIn.use_value();
	}

	// We don't do anything to end the eval of a control.
	end_eval()
	{
		// EMPTY
	}

  // Build the implementation of the control (a MuxView component)
  implement()
  {
    return ( <ProbeView
                x={this.x}
                y={this.y}
                wid={this.wid}
                value={this.value}
                key={this.key}
              />);
  }
};

export default DPProbe;
