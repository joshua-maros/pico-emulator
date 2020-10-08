// src/utils/PicoMemory.js - The memory for the processor
// PicoMemory items have the following:
//    An ID to locate the item
//    A key for the MemoryView
//    A label
//    A location on the screen
//    A length
//    An array of values
import React from 'react';
import MemoryView from '../components/MemoryView';
import RemoveQuotes from './RemoveQuotes';

class PicoMemory
{
	constructor(processor, id, key, label, x, y, length)
	{
		this.processor = processor;
		this.id = id;
    this.key = key;
    this.label = label;
    this.x = x;
    this.y = y;
    this.length = length;
    this.arr = new Array(length).fill('?');
		this.green = -1;
		this.blue = -1;
		this.red = -1;

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

	/*
	 * Set the value of the register
	 */
	set_value(idx, val)
	{
		this.arr[idx] = val;
	};

  /*
   * Return the value of the register
   */
  get_value(idx)
  {
    return this.arr[idx];
  }

	clear_highlights()
	{
		this.green = -1;
		this.blue = -1;
		this.red = -1;
	}

	set_green_highlight(idx)
	{
		this.green = idx;
	}

	set_blue_highlight(idx)
	{
		this.blue = idx;
	}

	set_red_highlight(idx)
	{
		this.red = idx;
	}

  /*
   * Build the implementation of the memory (a MemView component)
   */
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
								blue={this.blue}
								red={this.red}
								yellow={false}
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

export default PicoMemory;
