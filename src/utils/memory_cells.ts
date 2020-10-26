/* eslint no-throw-literal: "off" */

// src/utils/MemoryCell.js - A register for the processor
// Stores its name so it can report errors when using valueAsNumber.
// The memory is made up of a list of registers.

// Describes the last thing a register was used for.
export type CellUse = 'none' | 'read' | 'write' | 'error' | 'instruction' | 'jump_target' | 'address';

export class DataCell<T>
{
  #label: string;
  #value: T | undefined = undefined;
  lastUse: CellUse = 'none';

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

  set value(value: T | undefined)
  {
    this.#value = value;
  }

  get value(): T | undefined
  {
    return this.#value;
  }
}

export class MemoryCell extends DataCell<string> { }
export class FlagCell extends DataCell<boolean> { }
