// src/utils/DecoderLoader.js - Utility to load the decoder from
// a csv file.
import RemoveQuotes from './RemoveQuotes';

class DecoderLoader
{

  // Fill from the contents of a CSV file
  fillFromCSV(contents, processor)
  {
    // Initialize the decoder (so all the controls are 'off')
    processor.build_decoder();

    // Split the csv data into an array with one entry per line of the file.
    // Then iterate over each of these lines.
		const arr = contents.split('\n');
		for (let i = 0; i < arr.length; i++)
		{
			const str = arr[i];

      // Skip any line that is empty
			if (str.length === 0)
			{
				continue;
			}

			// We now have one line of the csv file.  Split at the commas:
			const arr2 = str.split(',');
      const len = arr2.length;
			if (len < 4 || len > 5)
			{
        processor.add_error('Line ' + (i + 1) + ': line does not have opcode, cycle, type, control, value: ' + str);
				continue;
			}

      // Pull out the 4 or 5 values.  Note that the various strings might be
      // in quotes (which we strip off).
      const arr3 = arr2.map(str => RemoveQuotes(str));
      const op = arr3[0];
      const cycle = arr3[1];
      const type = parseInt(arr3[2]);
      const sig = arr3[3]; // Either control name or next cycle.
      let val = 'Unknown';
      if (type !== 0)
      {
        val = 0;
      }
      else
      {
        const str = arr3[4];
        if (str === 'true')
        {
          val = 1;
        }
        else if (str === 'false')
        {
          val = 0;
        }
        else
        {
          val = parseInt(str);
        }
      }

      // Check to see if the values are valid.
      if (processor.is_opcode(op) === false)
      {
        processor.add_error('Line ' + (i + 1) + ': ' + op + ' is not an opcode');
        continue;
      }
      if (processor.is_cycle(cycle) === false)
      {
        processor.add_error('Line ' + (i + 1) + ': ' + cycle + ' is not a cycle');
        continue;
      }
      if (type === 0)
      {
        if (processor.is_control(sig) === false)
        {
          processor.add_error('Line ' + (i + 1) + ': ' + sig + ' is not a control');
          continue;
        }
      }
      else
      {
        if (processor.is_cycle(sig) === false)
        {
          processor.add_error('Line ' + (i + 1) + ': ' + sig + ' is not a cycle');
          continue;
        }
      }

      // Select the indicated row of the decoder, then set the value.
      const set = processor.decoder[op];
      const row = set[cycle];

      if (type === 1)
      {
        // This is a line that sets the next cycle
        row.next = sig;
      }
      else
      {
        // This is a line that sets a control signal
        const ctrl = row.controls[sig];
        if (ctrl.limit === 0)
        {
          ctrl.val = (val !== 0);
        }
        else
        {
          ctrl.val = val % ctrl.limit;
        }
      }
		}
		processor.rebuild();
  }
};

export default DecoderLoader;
