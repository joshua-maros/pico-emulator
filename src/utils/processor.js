// src/utils/processor.js - List of all the items in the processor
import React from 'react';

class Processor
{
	constructor()
	{
		// The list of things to display in the svg
		this.items = [];
		// The list of things to display after the svg
		this.extras = [];
		// A list of error messages
		this.errors = [];
		// Are we 'running' the code for a processor?
		this.running = false;
		// Are we running fast or slow?
		this.fast = false;
		// The timer used while running
		this.timer = null;
		// The processor calls this function when its state has changed,
		// causing the view to be recomputed:
		this.rebuild = null;
		// Before doing a rebuild, this callback may be called to 'prepare' for
		// the rebuild.  In the datapath view, this is used to do the eval of the
		// logic.
		this.prebuild = null;
		// To implement running, this callback should be set: it is the
		// code that computes the next state of the processor.
		this.step = null;
		// The size of the view (the svg portion)
		this.viewWid = 800;
		this.viewHgt = 600;

		// For a 'datapath' version of the processor, we have an array of
		// opcodes, an array of possible decoder cycles, an array of
		// control names and types, and the decoder.
		this.opcodes = [];
		this.cycles = [];
		this.controls = [];
		this.decoder = [];

		// As we are filling the decoder, we have a 'current Opcode' and
		// 'current Cycle'.  These values are the names of the opcode and cycle.
		this.curOpcode = null;
		this.curCycle = null;

		// When we are going to download a CSV file, the data will temporarily
		// be placed here:
		this.csvData = null;

		// If we have a PicoValueEditor gate, these three values hold the parameters
		// to that gate:
		this.watchLabel = null;
		this.watchValue = '';
		this.watchCallback = null;
		this.watchCount = 0;

		this.statusMessage = this.statusMessage.bind(this);
	};

	// Clear all of the items in the processor:
	clear_items()
	{
		this.items = [];
		this.extras = [];
		this.errors = [];
		this.running = false;
		this.fast = false;
		this.timer = null;
		this.step = null;
		this.opcodes = [];
		this.cycles = [];
		this.controls = [];
		this.decoder = [];
		this.curOpcode = null;
		this.curCycle = null;
		this.csvData = null;
		this.watchLabel = null;
		this.watchValue = '';
		this.watchCallback = null;
		this.watchCount = 0;
	}

	// Set the size of the svg portion of the view
	set_size(wid, hgt)
	{
		this.viewWid = wid;
		this.viewHgt = hgt;
	}

	// This callback is what we call when the processor's state changes, to
	// cause a re-do of the view.
	set_rebuild(callback)
	{
		this.rebuild = callback;
	}

	set_prebuild(callback)
	{
		this.prebuild = callback;
	}

	// This sets the 'step' callback, which is used to compute the next
	// state of the processor.
	set_step(callback)
	{
		this.step = callback;
	}

	// When the process has CSV data to write, this function is called.
	// This can also be called to clear the CSV data.
	set_csv_data(data)
	{
		this.csvData = data;
		this.rebuild();
	}

	// Clear all of the errors
	clear_errors()
	{
		this.errors = [];
	}

	has_errors()
	{
		return this.errors.length > 0;
	}

	// Add a new item to the processor.  This will draw in the svg
	// portion of the display, and is an 'svg' entity.
	add_item(item)
	{
		this.items.push(item);
	};

	// Add a new 'extra' to the processor.  This draws below the svg
	// portion, and is an 'html' entity.
	add_extra(item, col, row)
	{
		this.extras.push({item:item, col:col, row:row});
	}

	// Add an error message.  The display of error messages supercedes the
	// items and extras.
	add_error(msg)
	{
		if (this.errors.length < 100)
		{
			this.errors.push(msg);
		}
	}

	// Add an opcode to the array of possibilities
	add_opcode(code)
	{
		this.opcodes.push(code);
	}

	add_opcodes(list)
	{
		this.opcodes = this.opcodes.concat(list);
	}

	is_opcode(code)
	{
		return this.opcodes.includes(code);
	}

	// Add a cycle to the array of possibilities
	add_cycle(cycle)
	{
		this.cycles.push(cycle);
	}

	add_cycles(list)
	{
		this.cycles = this.cycles.concat(list);
	}

	is_cycle(cycle)
	{
		return this.cycles.includes(cycle);
	}

	// Add a control to the array of possibilities.  There are two
	// types of control: single-bit and multi-bit.  The multi-bit controls
	// have an enumeration of the possible values.  The 'list' input here
	// will be [] for a single-bit control or the enumeration
	// values for a multi-bit control.
	add_control(name, list)
	{
		const len = list.length;
		const val = (len === 0) ? 0 : list[0];
		this.controls.push({name:name, len:len, list:list, val:val, curIdx:0});
	}

	is_control(name)
	{
		for (let i = 0; i < this.controls.length; i++)
		{
			if (this.controls[i].name === name)
			{
				return true;
			}
		}
		return false;
	}

	// When we have finished adding all of the opcodes, cycles, and controls
	// to the processor, this function is called to build the decoder.  It can
	// also be called to 'reset' the decoder.
	build_decoder()
	{
		this.decoder = [];
		this.opcodes.forEach(opcode =>
			{
				let vec = [];
				this.cycles.forEach(cycle =>
					{
						let arr = [];
						this.controls.forEach(ctrl =>
							{
								if (ctrl.len === 0)
								{
									arr[ctrl.name] = {val:false, limit:0};
								}
								else
								{
									arr[ctrl.name] = {val:0, limit:ctrl.len};
								}
							});
						vec[cycle] = {controls:arr, next:cycle};
					});
				this.decoder[opcode] = vec;
			});
		this.curOpcode = this.opcodes[0];
		this.curCycle = this.cycles[0];
	}

	// Generate the csv data for the decoder
	decoder_to_csv()
	{
		let result = [];
		this.opcodes.forEach(opcode =>
			{
				this.cycles.forEach(cycle =>
					{
						let any = false;
						this.controls.forEach(ctrl =>
							{
								let x = this.decoder[opcode][cycle].controls[ctrl.name];
								if (x.len === 0)
								{
									if (x.val)
									{
										result.push([opcode, cycle, 0, ctrl.name, 1]);
										any = true;
									}
								}
								else
								{
									if (x.val > 0)
									{
										result.push([opcode, cycle, 0, ctrl.name, x.val]);
										any = true;
									}
								}
							});
						if (any)
						{
							result.push([opcode, cycle, 1, this.decoder[opcode][cycle].next, 0])
						}
					});
			});
		return result;
	}

	// Find an item by ID
	find_item(id)
	{
		for (let i = 0; i < this.items.length; i++)
		{
			let x = this.items[i];
			if (x.id === id)
			{
				return x;
			}
		}
		return null;
	}

	stop_running()
	{
		if (this.running)
		{
			this.running = false;
			clearTimeout(this.timer);
			this.timer = null;
		}
	}

	start_running(fast)
	{
		this.fast = fast;
		if (this.running === false)
		{
			this.running = true;
			this.tick();
		}
	}

	tick()
	{
		if (this.timer !== null)
		{
			clearTimeout(this.timer);
		}
		this.timer = null;
		if (this.step)
		{
			this.step();
			this.rebuild();
		}
		if (this.running)
		{
			let speed = this.fast ? 500 : 2500;
			this.timer = setTimeout(()=> this.tick(), speed);
		}
	}

	// Stop the current 'run' of the processor
	halt()
	{
		this.running = false;
	}

	// When we change the opcode, cycle, or next, this is called to update
	// the status message.
	statusMessage()
	{
			return 'Viewing ' + this.curOpcode + ' cycle ' + this.curCycle + ': next ' + this.cur_next();
	}

	// Set the current opcode.  If the value given is not one of the
	// opcodes, we do not change the current opcode.
	set_opcode(code)
	{
		if (this.opcodes.includes(code))
		{
			this.curOpcode = code;
			this.rebuild();
		}
	}

	// Set the current cycle.  If the value given is not one of the
	// cycle names, we do not change the current cycle.
	set_cycle(cycle)
	{
		if (this.cycles.includes(cycle))
		{
			this.curCycle = cycle;
			this.rebuild();
		}
	}

	// Set the next cycle in the decoder for the current opcode and cycle.
	set_decoder_next(cycle)
	{
		if (this.cycles.includes(cycle))
		{
			this.decoder[this.curOpcode][this.curCycle].next = cycle;
			this.rebuild();
		}
	}

	get_dp_control(key)
	{
		let set = this.decoder[this.curOpcode];
		if (set === null || set === undefined)
		{
			this.add_error('Processor does not have opcode ' + this.curOpcode);
			return false;
		}
		let row = set[this.curCycle];
		if (row === null || row === undefined)
		{
			this.add_error('Processor does not have cycle ' + this.curCycle);
			return false;
		}
		let ctrl = row.controls[key];
		if (ctrl === null || ctrl === undefined)
		{
			this.add_error('Processor does not have control ' + key);
			return false;
		}
		if (ctrl.val === true || ctrl.val === false)
		{
			return ctrl.val;
		}
		if (ctrl.val >= 0 && ctrl.val <= 1000)
		{
			return ctrl.val;
		}
		console.log('For opcode ' + this.curOpcode + ' and cycle ' + this.curCycle + ', the value for control ' + key + ' is ' + ctrl.val);
		return false;
	}

	set_dp_control(key, val)
	{
		this.decoder[this.curOpcode][this.curCycle].controls[key].val = val;
	}

	toggle_dp_control(key, val)
	{
		const ctrl = this.decoder[this.curOpcode][this.curCycle].controls[key];
		ctrl.val = !ctrl.val;
	}

	inc_dp_control(key)
	{
		const ctrl = this.decoder[this.curOpcode][this.curCycle].controls[key];
		ctrl.val = (ctrl.val + 1) % ctrl.limit;
	}

	cur_next()
	{
		return this.decoder[this.curOpcode][this.curCycle].next;
	}

	// Set the parameters for a possible PicoValueEditor:
	set_watch(label, value, callback)
	{
		this.watchLabel = label;
		this.watchValue = (value === null) ? '' : value;
		this.watchCallback = callback;
		this.watchCount++;
		this.rebuild();
	}

	// This is used to build the view of the svg: for each item in the
	// array it builds the actual svg entity to display that item.
	implement(list)
 	{
 		for (let i = 0; i < this.items.length; i++)
 		{
 			list.push(this.items[i].implement());
 		}
 	}

	// This is used to build the view of the extras: for each extra in
	// the array, it builds the actual html entity to display that extra.
	implementExtras(list)
	{
		if (this.extras.length === 0)
		{
			return;
		}
		// Get the maximum row and column number
		let maxcol = 0, maxrow = 0;
		for (let i = 0; i < this.extras.length; i++)
		{
			let info = this.extras[i];
			maxcol = (info.col > maxcol) ? info.col : maxcol;
			maxrow = (info.row > maxrow) ? info.row : maxrow;
		}
		let rowlist = [];
		const tdstyle = {width:300, padding:4};
		for (let row = 0; row <= maxrow; row++)
		{
			let collist = [];
			for (let i = 0; i < this.extras.length; i++)
			{
				let info = this.extras[i];
				if (info.row !== row)
				{
					continue;
				}
				collist[info.col] = <td key={info.col + 1} style={tdstyle}>{info.item.implement()}</td>;
			}
			for (let col = 0; col <= maxcol; col++)
			{
				if (collist[col] === null)
				{
					collist[col] = <td key={col + 1} style={tdstyle}></td>;
				}
			}
			rowlist.push(<tr key={row + 1}>{collist}</tr>);
		}
		list.push(
			<table key='zyxxy'><tbody>{rowlist}</tbody></table>
		);
	}
};

export default Processor;
