// src/utils/PicoReg.js - A register for the processor
// PicoReg items have the following:
//    An ID to locate the item
//    A label
//    A location on the screen
//    A value
//    A key for the RegView

export default class PicoReg
{
  #label: string;
  #value = '';

	constructor(label: string)
	{
    this.#label = label;
  };
  
  set value(value: string) {
    this.#value = value;
  }

  get value(): string {
    return this.#value;
  }
};
