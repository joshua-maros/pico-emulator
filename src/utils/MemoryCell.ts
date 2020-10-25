/* eslint no-throw-literal: "off" */

// src/utils/MemoryCell.js - A register for the processor
// Stores its name so it can report errors when using valueAsNumber.
// The memory is made up of a list of registers.

// Describes the last thing a register was used for.
export type MemoryUse = 'none' | 'read' | 'write' | 'error' | 'instruction' | 'jump_target';

export default class MemoryCell
{
  #label: string;
  #value: string | undefined = undefined;
  lastUse: MemoryUse = 'none';

  constructor(label: string)
  {
    this.#label = label;
  };

  clearLastUse()
  {
    this.lastUse = 'none';
  }

  // Add this CSS class to an object to color it based on how this memory cell
  // was last used.
  get lastUseCssClass(): string
  {
    return 'use_' + this.lastUse;
  }

  get label(): string
  {
    return this.#label;
  }

  get initialized(): boolean
  {
    return this.#value !== '?';
  }

  set value(value: string | undefined)
  {
    this.#value = value;
  }

  get value(): string | undefined
  {
    return this.#value;
  }
};
