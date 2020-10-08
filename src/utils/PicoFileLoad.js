// src/utils/PicoFileLoad.js - A file loader for Pico
// PicoFileLoad items have the following:
//    A label
//    The target for the data
//		The processor
//    A key for the viewer
import React from 'react';
import FileLoad from '../components/FileLoad';

class PicoFileLoad
{
	constructor(key, label, processor, target)
	{
    this.key = key;
    this.label = label;
    this.target = target;
		this.processor = processor;
	};

  // Build the implementation of the file loader (a FileLoad component)
  implement()
  {
    return ( <FileLoad processor={this.processor} target={this.target} key={this.key} label={this.label} />);
  }
};

export default PicoFileLoad;
