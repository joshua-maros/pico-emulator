// src/utils/PicoSelect.js - A 'Select' control
// PicoSelect items have the following:
//  label
//  options
//  current (also a callback)
//  callback
import React from 'react';
import SelectView from '../components/SelectView';

class PicoSelect
{
  constructor(key, label, options, current, callback)
  {
    this.key = key;
    this.label = label;
    this.options = options;
    this.current = current;
    this.callback = callback;
  }

  implement()
  {
    let current = this.current();
    // console.log('Fetched ' + current + ' as current select');
    return (
      <SelectView
        label={this.label}
        key={this.key}
        options={this.options}
        current={current}
        callback={this.callback}
      />);
  }
}

export default PicoSelect;
