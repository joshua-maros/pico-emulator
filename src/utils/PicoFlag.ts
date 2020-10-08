// src/utils/PicoFlag.js - A flag (bit) for the processor
// PicoFlag items have the following:
//    An ID to locate the item
//    A label
//    A location on the screen
//    A value
//    A key for the FlagView

export default class PicoFlag
{
  #label: string;
  #value: boolean;

	constructor(label: string)
	{
    this.#label = label;
    this.#value = false;
	};

  set value(value: boolean) {
    this.#value = value;
  }

  get value(): boolean {
    return this.#value;
  }
};
