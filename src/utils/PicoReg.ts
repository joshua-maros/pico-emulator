/* eslint no-throw-literal: "off" */

// src/utils/PicoReg.js - A register for the processor
// Stores its name so it can report errors when using valueAsNumber.
// The memory is made up of a list of registers.

export default class PicoReg
{
  #label: string;
  #value = '?';

	constructor(label: string)
	{
    this.#label = label;
  };

  get label(): string {
    return this.#label;
  }

  get initialized(): boolean {
    return this.#value !== '?';
  }
  
  set value(value: string) {
    this.#value = value;
  }

  get value(): string {
    return this.#value;
  }

  set valueAsNumber(value: number) {
    this.#value = '' + value;
  }

  // Throws an exception if this register is not holding a number.
  get valueAsNumber(): number {
    if (!this.initialized) {
      throw this.#label + ' is not initialized'
    }
    let value = parseInt(this.#value);
    if (isNaN(value)) {
      throw this.#label + ' contains "' + this.#value + '", expected a number';
    } else {
      return value;
    }
  }
};
