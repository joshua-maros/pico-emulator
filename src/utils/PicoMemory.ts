// src/utils/PicoMemory.js - The memory for the processor
// PicoMemory items have the following:
//    An ID to locate the item
//    A key for the MemoryView
//    A label
//    A location on the screen
//    A length
//    An array of values

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
	setValue(idx: number, val: string)
	{
		this.#data[idx] = val;
	};

  /*
   * Return the value of the register
   */
  getValue(idx: number): string
  {
    return this.#data[idx];
  }
};
