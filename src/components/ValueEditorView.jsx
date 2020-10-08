// src/components/ValueEditorView.jsx
// This is the component for bringing up an editor for a value (like a latch value)
import React, {Component} from 'react';

// This is passed:
//  mykey
//  x, y, wid
//  label
//  value
//  callback
class ValueEditorView extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {value: ''};
    this.handleGet = this.handleGet.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleGet(event)
  {
    this.setState({value: this.props.value});
    event.preventDefault();
  }

  handleChange(event)
  {
    this.setState({value: event.target.value});
  }

  handleSubmit(event)
  {
    this.props.callback(this.state.value);
    event.preventDefault();
  }

  render()
	{
    const {label} = this.props;
		return (
      <form onSubmit={this.handleSubmit}>
        <label>
          {label}
          <input type='text' value={this.state.value} onChange={this.handleChange}/>
        </label>
        {(this.props.callback !== null) && <input type='button' name='get' value='Get' onClick={this.handleGet}/>}
        {(this.props.callback !== null) && <input type='submit' value='Submit' /> }
      </form>
    );
	}
};

export default ValueEditorView;
