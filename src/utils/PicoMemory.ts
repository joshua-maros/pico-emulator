/* eslint no-throw-literal: "off" */

// src/utils/PicoMemory.js - The memory for the processor
// Stores an array of PicoReg objects, one for each memory location.

import PicoReg from "./PicoReg";

export default class PicoMemory
{
  #data: Array<PicoReg>;
  constructor(length: number)
  {
    this.#data = new Array(length).fill(0).map(
      (_value, index) => new PicoReg(`MEM[${index}]`)
    );
  };

  get(idx: number): PicoReg
  {
    if (idx >= this.#data.length)
    {
      throw `${idx} is not a valid memory address`;
    }
    return this.#data[idx];
  }

  // Sets all bytes in memory to ?
  clear()
  {
    for (let byte of this.#data)
    {
      byte.value = '?';
    }
  }
};
