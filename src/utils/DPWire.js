// src/utils/DPWire.js - A wire for the datapath view
import React from 'react';
import WireView from '../components/WireView';
import DPConnector from './DPConnector';

class DPWire
{
	constructor(processor, id, key, label, x, y)
	{
    this.processor = processor;
		this.id = id;
    this.key = key;
		this.label = label;
		this.x = x;
		this.y = y;

    // A wire has an array of input connections,
    // and array of output connections, and an
    // array of line segments.
		this.inConnectors = [];
    this.outConnectors = [];
    this.segments = [];

    // During simulation, the 'value' of the wire
    this.value = 'Unknown';
	};

	// Add an input connection
	connectToGateOutput(gateName, pinName)
	{
    const gate = this.processor.find_item(gateName);
    if (gate === null)
    {
      this.processor.add_error('For wire ' + this.id + ', there is no gate named ' + gateName);
    }
    const conn = new DPConnector(this.processor, this, gate, pinName);
    if (conn !== null)
    {
			if (conn.gate === null)
			{
				this.processor.add_error('For wire ' + this.id + ', did not connect to gate ' + gateName + ', pin ' + pinName);
			}
      this.inConnectors.push(conn);
    }
	}

	// Add an output connection
	connectToGateInput(gateName, pinName)
	{
    const gate = this.processor.find_item(gateName);
    if (gate === null)
    {
      this.processor.add_error('For wire ' + this.id + ', there is no gate named ' + gateName);
    }
    const conn = new DPConnector(this.processor, this, gate, pinName);
    if (conn !== null)
    {
			if (conn.gate === null)
			{
				this.processor.add_error('For wire ' + this.id + ', did not connect to gate ' + gateName + ', pin ' + pinName);
			}
      this.outConnectors.push(conn);
    }
	}

  // Add a segment to the wire
  addSegment(x1, y1, x2, y2)
  {
    this.segments.push({x1:x1, y1:y1, x2:x2, y2:y2, src:0, used:false});
  }

  // For simple cases, this connects to two gates and draws the path
  // between them.
  pinToPin(gateName1, pinName1, gateName2, pinName2, path)
  {
    this.connectToGateOutput(gateName1, pinName1);
    this.connectToGateInput(gateName2, pinName2);
    if (this.inConnectors.length !== 1 || this.outConnectors.length !== 1)
    {
      return;
    }
		this.pinToPinPath(path);
	}

	pinToPinPath(path)
	{
    const x1 = this.inConnectors[0].x;
    const y1 = this.inConnectors[0].y;
    const x2 = this.outConnectors[0].x;
    const y2 = this.outConnectors[0].y;
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    switch (path)
    {
      case 'H':
        if (y1 !== y2)
        {
          this.processor.add_error('In pinToPin for wire ' + this.id + ' the connectors do not line up (' + y1 + ' vs ' + y2 + ').');
          return;
        }
        this.addSegment(x1, y1, x2, y2);
        break;
      case 'V':
        if (x1 !== x2)
        {
          this.processor.add_error('In pinToPin for wire ' + this.id + ' the connectors do not line up (' + x1 + ' vs ' + x2 + ').');
          return;
        }
        this.addSegment(x1, y1, x2, y2);
        break;
      case 'HV':
        this.addSegment(x1, y1, x2, y1);
        this.addSegment(x2, y1, x2, y2);
        break;
      case 'VH':
        this.addSegment(x1, y1, x1, y2);
        this.addSegment(x1, y2, x2, y2);
        break;
      case 'HVH':
        this.addSegment(x1, y1, cx, y1);
        this.addSegment(cx, y1, cx, y2);
        this.addSegment(cx, y2, x2, y2);
        break;
      case 'VHV':
        this.addSegment(x1, y1, x1, cy);
        this.addSegment(x1, cy, x2, cy);
        this.addSegment(x2, cy, x2, y2);
        break;
      default:
        break;
    }
  }

	// Add a list of input connections
	add_inputs(list)
	{
		for (let i = 0; i < list.length; i++)
		{
			let port = list[i];
			this.connectToGateOutput(port.gate, port.pin);
		}
	}

	// Add a list of output connections
	add_outputs(list)
	{
		for (let i = 0; i < list.length; i++)
		{
			let port = list[i];
			this.connectToGateInput(port.gate, port.pin);
		}
	}

	// Add the segments to the wires
	set_path(str)
	{
		const arr = str.split(' ');
		let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
		let mode = 0;
		let idx;
		let stk = [];
		for (let i = 0; i < arr.length; i++)
		{
			let op = arr[i];
			if (op === 'H' || op === 'V' || op === 'HV' || op === 'VH' || op === 'HVH' || op === 'VHV')
			{
				// A normal single-wire connection.
				this.pinToPinPath(op);
				return;
			}

			// Move from p2 to p1
			x1 = x2;
			y1 = y2;

			let t, v;

			switch (op)
			{
				case 'i':
					// This should be followed by a number which is the input number,
					// followed by 'x', 'y', or 'xy'.
					idx = parseInt(arr[i + 1]);
					switch (arr[i + 2])
					{
						case 'x':
							x2 = this.inConnectors[idx].x;
							break;
						case 'y':
							y2 = this.inConnectors[idx].y;
							break;
						case 'xy':
							x2 = this.inConnectors[idx].x;
							y2 = this.inConnectors[idx].y;
							break;
						default:
							break;
					}
					i += 2;
					break;
				case 'o':
					// This should be followed by a number which is the output number,
					// followed by 'x', 'y', or 'xy'.
					idx = parseInt(arr[i + 1]);
					switch (arr[i + 2])
					{
						case 'x':
							x2 = this.outConnectors[idx].x;
							break;
						case 'y':
							y2 = this.outConnectors[idx].y;
							break;
						case 'xy':
							x2 = this.outConnectors[idx].x;
							y2 = this.outConnectors[idx].y;
							break;
						default:
							break;
					}
					i += 2;
					break;
				case 'l':
					// This is move left (relative)
					x2 -= parseInt(arr[i + 1]);
					i++;
					break;
				case 'r':
					// This is move right (relative)
					x2 += parseInt(arr[i + 1]);
					i++;
					break;
				case 'u':
					// This is move down (relative)
					y2 -= parseInt(arr[i + 1]);
					i++;
					break;
				case 'd':
					// This is move up (relative)
					y2 += parseInt(arr[i + 1]);
					i++;
					break;
				case '^':
					t = parseInt(arr[i + 1]);
					switch (arr[i + 2])
					{
						case 'x':
							stk[t] = {val:x2, isX:true, isBoth:false};
							break;
						case 'y':
							stk[t] = {val:y2, isX:false, isBoth:false};
							break;
						case 'xy':
						    stk[t] = {val:x2, valy:y2, isBoth:true};
						    break;
						default:
							break;
					}
					i += 2;
					continue;
				case '$':
					t = parseInt(arr[i + 1]);
					v = stk[t];
					if (v)
					{
					    if (v.isBoth)
					    {
					        x2 = v.val;
					        y2 = v.valy;
					    }
						else if (v.isX)
						{
							x2 = v.val;
						}
						else
						{
							y2 = v.val;
						}
					}
					i++;
					break;
				case 'X':
					// Move to in X
					x2 = parseInt(arr[i + 1]);
					i++;
					break;
				case 'Y':
					// Move to in Y
					y2 = parseInt(arr[i + 1]);
					i++;
					break;
				case ';':
					// Start a new segment
					x1 = 0;
					y1 = 0;
					x2 = 0;
					y2 = 0;
					mode = -1;
					break;
				default:
					break;
			}
			if (mode === 1)
			{
				this.addSegment(x1, y1, x2, y2);
				continue;
			}
			mode++;
		}
	}

	// We start by setting the wire to 'unknown' and we turn off all
  // the connectors.
	begin_eval()
	{
		this.value = 'Unknown';
        for (let i = 0; i < this.inConnectors.length; i++)
        {
          let c = this.inConnectors[i];
          c.active = false;
          c.used = false;
          c.value = 'Unknown';
        }
        for (let i = 0; i < this.outConnectors.length; i++)
        {
          let c = this.outConnectors[i];
          c.active = false;
          c.used = false;
          c.value = 'Unknown';
        }
	}

	// Evaluate this gate:
	eval()
	{
        // See how many inputs are actively driving, and get the value of one of them.
        let value = 'Unknown';
        let numDrivers = 0;
        for (let i = 0; i < this.inConnectors.length; i++)
        {
          let c = this.inConnectors[i];
          if (c.active)
          {
            numDrivers++;
            value = c.value;
          }
        }
        if (numDrivers > 1)
        {
          value = 'Conflict';
        }

        this.find_used();

        // If the wire already has the value, we are done.
        if (this.value === value)
        {
          return;
        }

        // Set the wire's value, and set all the output
        // connectors (and evaluate their gates).
        this.value = value;
        for (let i = 0; i < this.outConnectors.length; i++)
        {
          let c = this.outConnectors[i];
          c.active = true;
          c.value = value;
          c.gate.eval();
        }
	}

    // Find the used segments of this wire
    find_used()
    {
        // Mark all segments as not used, no source
        for (let i = 0; i < this.segments.length; i++)
        {
            const seg = this.segments[i];
            seg.used = false;
            seg.src = 0;
        }

        // For each input connector, if that connector is active,
        // set it's segment to point to it (and do path finding through the network)
        for (let i = 0; i < this.inConnectors.length; i++)
        {
            let c = this.inConnectors[i];
            if (c.active)
            {
                this.markSource(c.x, c.y);
            }
        }

        // For each output connector, if that connector is used,
        // set it's segment to be used, and do the path finding on that.
        for (let i = 0; i < this.outConnectors.length; i++)
        {
            let c = this.outConnectors[i];
            if (c.used)
            {
                this.markUsed(c.x, c.y);
            }
        }

        // Now mark any input as used if its segment is used
        for (let i = 0; i < this.inConnectors.length; i++)
        {
            let c = this.inConnectors[i];
            c.used = false;
            if (c.active)
            {
                if (this.isUsed(c.x, c.y))
                {
                    c.used = true;
                }
            }
        }
    }

    // We have a source driving point x, y.  Find all segments that
    // refer to this point that don't have their src set, then set it accordingly.
    markSource(x, y)
    {
        for (let i = 0; i < this.segments.length; i++)
        {
            const seg = this.segments[i];
            if (seg.src === 0)
            {
                if (seg.x1 === x && seg.y1 === y)
                {
                    seg.src = 1;
                    this.markSource(seg.x2, seg.y2);
                }
                else if (seg.x2 === x && seg.y2 === y)
                {
                    seg.src = 2;
                    this.markSource(seg.x1, seg.y1);
                }
            }
        }
    }

    // Is the segment connected to this source used?
    isUsed(x, y)
    {
        for (let i = 0; i < this.segments.length; i++)
        {
            const seg = this.segments[i];
            if (seg.x1 === x && seg.y1 === y)
            {
                return seg.used;
            }
            if (seg.x2 === x && seg.y2 === y)
            {
                return seg.used;
            }
        }
    }

    // We are using a value at point x, y.  Find the segment driving this point
    // and mark that segment as used.  Then follow this segment's src and do the same.
    markUsed(x, y)
    {
        for (let i = 0; i < this.segments.length; i++)
        {
            const seg = this.segments[i];
            if (seg.used === false)
            {
                if (seg.x1 === x && seg.y1 === y)
                {
                    if (seg.src === 2)
                    {
                        seg.used = true;
                        this.markUsed(seg.x2, seg.y2);
                    }
                }
                else if (seg.x2 === x && seg.y2 === y)
                {
                    if (seg.src === 1)
                    {
                        seg.used = true;
                        this.markUsed(seg.x1, seg.y1);
                    }
                }
            }
        }
    }

	// We don't do anything to end the eval of a wire.
	end_eval()
	{
		// EMPTY
	}

	get_value()
	{
		return this.value;
	}

  // Build the implementation of the wire (a WireView component)
  implement()
  {
    return ( <WireView
                value={this.value}
                key={this.key}
                segments={this.segments}
								label={this.label}
								x={this.x}
								y={this.y}
              />);
  }
};

export default DPWire;
