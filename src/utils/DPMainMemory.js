// src/utils/DPMainMemory.js - The main memory for the datapath view
import React from 'react';
import MemoryView from '../components/MemoryView';
import AsUnsignedNBits from './AsUnsignedNBits';
import AsNBits from './AsNBits';
import RemoveQuotes from './RemoveQuotes';

// The 'Load' input is optional
class DPMainMemory
{
	constructor(processor, id, key, label, x, y, databits, addrbits, addrY, memrY, memwY, dataY)
	{
    this.processor = processor;
		this.id = id;
    this.key = key;
		this.label = label;
    this.x = x;
    this.y = y;
    this.databits = databits;
    this.addrbits = addrbits;
		this.length = (1 << addrbits);
    this.addrY = addrY;
    this.memrY = memrY;
    this.memwY = memwY;
    this.dataY = dataY;

    this.arr = new Array(this.length).fill('?');
		this.green = -1;
    this.noAddr = true;

		// We do not yet have the connections
    this.connectAddr = null;
    this.connectMemr = null;
    this.connectMemw = null;
		this.connectDin = null;
    this.connectDout = null;

    this.evaling = false;

		this.handleClick = this.handleClick.bind(this);
	};

	// This is called when the Value Editor submit is pressed
	setMyValue(idx, value)
	{
		this.arr[idx] = value;
		//this.processor.rebuild();
		this.handleClick((idx + 1) % this.length);
	}

	// This is called when the person clicks on the latch in the view.
	// It sets the Value Editor to point to this latch
  handleClick(idx)
  {
		const myLabel = this.label + '[' + idx + ']';
		const myValue = this.arr[idx];
		const mySetValue = this.setMyValue.bind(this, idx);
		this.processor.set_watch(myLabel, myValue, mySetValue);
  }

	// Add a connection
	connectToPin(connector, pinName)
	{
    if (pinName === 'Addr')
		{
			this.connectAddr = connector;
			connector.set_location(this.x - 20, this.y + this.addrY);
			return;
		}
    if (pinName === 'Memr')
		{
			this.connectMemr = connector;
			connector.set_location(this.x - 20, this.y + this.memrY);
			return;
		}
    if (pinName === 'Memw')
		{
			this.connectMemw = connector;
			connector.set_location(this.x - 20, this.y + this.memwY);
			return;
		}
    if (pinName === 'Din')
		{
			this.connectDin = connector;
			connector.set_location(this.x - 20, this.y + this.dataY);
			return;
		}
		if (pinName === 'Dout')
		{
			this.connectDout = connector;
			connector.set_location(this.x - 20, this.y + this.dataY - 20);
			return;
		}
		this.processor.add_error('A DPMainMemory gate does not have a pin named ' + pinName);
	}

	// We don't do anything to begin the eval of a control.
	begin_eval()
	{
		// EMPTY
	}

	// Evaluate this gate.  This gate constantly sends out its stored value.
	eval()
	{
         if (this.evaling)
         {
           return;
         }
       // Only eval if this is connected.
        if (this.connectAddr === null || this.connectMemr === null
          || this.connectMemw === null || this.connectDin === null
          || this.connectDout === null)
        {
          return;
        }
        this.evaling = true;
        const memr = this.connectMemr.use_value();
        const memw = this.connectMemw.use_value();
        if (memr === 'Conflict' || memr === 'Unknown' || memw === 'Conflict' || memw === 'Unknown')
        {
          this.connectDout.set_value('Unknown');
        }
        if (memr === false && memw === false)
        {
          this.connectDout.clear_value();
          this.evaling = false;
          return;
        }
        if (memr === true && memw === true)
        {
          this.connectDout.set_value('Conflict');
          this.evaling = false;
          return;
        }
        const addr = AsUnsignedNBits(this.connectAddr.use_value(), this.addrbits);
        this.noAddr = false;
        if (addr === 'Conflict' || addr === 'Unknown')
        {
          this.noAddr = true;
          this.green = -1;
          this.evaling = false;
          this.connectDout.clear_value();
          return;
        }
        this.green = addr;
        if (memr === true)
        {
          this.connectDout.set_value(this.arr[addr]);
          this.evaling = false;
          return;
        }
        if (memw === true)
        {
            this.connectDout.clear_value();
            const data = AsNBits(this.connectDin.use_value(), this.databits);
            console.log('MemW data is ' + data + ', address is ' + addr);
            if (data === 'Conflict' || data === 'Unknown')
            {
                this.arr[addr] = '?';
            }
            else
            {
                this.arr[addr] = data;
            }
            this.evaling = false;
            return;
        }
        this.evaling = false;
	}

	// We don't do anything at the end of the eval.
	end_eval()
	{
    // EMPTY
	}

  // Build the implementation of the control (a MuxView component)
  implement()
  {
    return ( <MemoryView
                x={this.x}
                y={this.y}
                key={this.key}
                label={this.label}
                length={this.length}
                arr={this.arr}
                green={this.green}
                blue={-1}
                red={-1}
                yellow={this.noAddr}
								callback={this.handleClick}
              />);
  }

  // Fill from the contents of a CSV file
  fillFromCSV(contents, processor)
  {
		for (let i = 0; i < this.length; i++)
		{
			this.arr[i] = '?';
		}
		let errCount = 0;
		const arr = contents.split('\n');
		for (let i = 0; i < arr.length; i++)
		{
			let str = arr[i];
			if (str.length === 0)
			{
				continue;
			}

			// We now have one line of the csv file.  Split at the comma:
			let arr2 = str.split(',');
			if (arr2.length === 0)
			{
				continue;
			}
			if (arr2.length < 2)
			{
				errCount++;
				if (errCount < 10)
				{
					processor.add_error('Line ' + (i + 1) + ': line does not have address, data: ' + str);
				}
				else if (errCount === 10)
				{
					processor.add_error('Too many errors...');
				}
				continue;
			}
			if (arr2.length > 2)
			{
				errCount++;
				if (errCount < 10)
				{
					processor.add_error('Line ' + (i + 1) + ': line has too many values, we just want address, data: ' + str);
				}
				else if (errCount === 10)
				{
					processor.add_error('Too many errors...');
				}
				continue;
			}
			const arr3 = arr2.map(str => RemoveQuotes(str));
			let addr = parseInt(arr3[0], 10);
			if (addr < 0 || addr > 128)
			{
				errCount++;
				if (errCount < 10)
				{
					processor.add_error('Line ' + (i + 1) + ': address is out-of-bounds: ' + str);
				}
				else if (errCount === 10)
				{
					processor.add_error('Too many errors...');
				}
				continue;
			}
			let value = arr3[1].trim().toUpperCase();
			this.arr[addr] = value;
		}
		processor.rebuild();
  }

	to_csv()
	{
		let result = [];
		for (let i = 0; i < this.length; i++)
		{
			const val = this.arr[i];
			if (val === null || val === '' || val === '?')
			{
				continue;
			}
			result.push([i, val]);
		}
		return result;
	}
};

export default DPMainMemory;
