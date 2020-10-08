// src/components/SelectView.jsx
// This is the component for a Select control.  This is in the 'extras', not
// the 'items', as this is not in the SVG section.
// This is passed:
//  label
//  options
//  current
//  callback
import React, { Component } from 'react';

class SelectView extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {value: props.current};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event)
  {
    this.setState({value: event.target.value});
    this.props.callback(event.target.value);
  }

  handleSubmit(event)
  {
    event.preventDefault();
  }

  render()
  {
    let i = 1;
    const items = this.props.options.map(function(val){ return <option key={i++} value={val}>{val}</option>;});
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          {this.props.label}
          <select value={this.state.value} onChange={this.handleChange}>
            {items}
          </select>
        </label>
      </form>
    );
  }
}

export default SelectView;
