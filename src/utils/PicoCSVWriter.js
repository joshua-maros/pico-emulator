// src/utils/PicoCSVWriter.js - A file writer for Pico
import CSVButton from '../components/CSVButton';

class PicoCSVWriter
{
  constructor(key, label, fname, processor, writer)
  {
    this.key = key;
    this.label = label;
    this.fname = fname;
    this.processor = processor;
    this.writer = writer;

    this.csvWriter = this.csvWriter.bind(this);
    this.csvClear = this.csvClear.bind(this);
  }

  // Callback function to write the data (then clear it)
  csvWriter()
  {
    this.writer(this.processor);
  }

  csvClear()
  {
    this.processor.set_csv_data(null);
  }

  // Build the implementation
  implement()
  {
    return CSVButton(this.key, this.label, this.fname, this.processor.csvData, this.csvWriter, this.csvClear);
  }
}

export default PicoCSVWriter;
