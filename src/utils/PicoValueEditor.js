// src/utils/PicoValueEditor.js - A 'text entry' control
// PicoValueEditor items have the following:
//  processor
import React from 'react';
import ValueEditorView from '../components/ValueEditorView';

class PicoValueEditor
{
  constructor(key, processor)
  {
    this.key = key;
    this.processor = processor;
  }

  implement()
  {
    return (
      <ValueEditorView
        label={this.processor.watchLabel}
        key={this.key}
        value={this.processor.watchValue}
        callback={this.processor.watchCallback}
      />);
  }
}

export default PicoValueEditor;
