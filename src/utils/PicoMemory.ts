// src/utils/PicoMemory.js - The memory for the processor
// PicoMemory items have the following:
//    An ID to locate the item
//    A key for the MemoryView
//    A label
//    A location on the screen
//    A length
//    An array of values
import RemoveQuotes from './RemoveQuotes';

export default class PicoMemory
{
  #data: Array<string>;
	constructor(length: number)
	{
    this.#data = new Array(length).fill('?');
	};

	/*
	 * Set the value of the register
	 */
	set_value(idx: number, val: string)
	{
		this.#data[idx] = val;
	};

  /*
   * Return the value of the register
   */
  get_value(idx: number): string
  {
    return this.#data[idx];
  }
};
