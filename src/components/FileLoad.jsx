// src/components/FileLoad.jsx
// The FileLoad takes the following:
//		processor: the processor (to get error messages)
//		target: an object that implements the fillFromCSV(contents) method

import React, {Component} from 'react';

class FileLoad extends Component
{
	constructor(props)
	{
		super(props);
		this.fileReader = null;
	}

	handleFileRead(e)
	{
		const content = this.fileReader.result;
		this.props.target.fillFromCSV(content, this.props.processor);
	};

	handleFileError(e)
	{
		alert('Error reading file: ' + e);
		// TBD -- send to the processor's error function
	};

	handleFileChosen(e)
	{
		this.fileReader = new FileReader();
		this.fileReader.onloadend = this.handleFileRead.bind(this);
		this.fileReader.onerror = this.handleFileError.bind(this);
		this.fileReader.readAsText(e.target.files[0]);
	};

	render()
	{
		return <div>
						<span>
							{this.props.label}
						</span>
						<input type='file' accept='.csv' onChange={this.handleFileChosen.bind(this)} />
					</div>;
	}
};

/*
	const FileLoad = () =>
		{
			let fileReader;

			const handleFileRead = (e) =>
				{
					const content = fileReader.result;
					console.log(content);
					// .. do somthing with the content ..
				};

			const handleFileError = (e) =>
				{
					alert('Error reading file: ' + e);
				};

			const handleFileChosen = (file) =>
				{
					fileReader = new FileReader();
					fileReader.onloadend = handleFileRead;
					fileReader.onerror = handleFileError;
					fileReader.readAsText(file);
				};

			// Use accept or allow?
			return <div className='upload-expense'>
					<input type='file'
						id='file'
						className='input-file'
						accept='.csv'
						onChange={e => handleFileChosen(e.target.files[0])}
						/>
				</div>;
		};
*/

export default FileLoad;
