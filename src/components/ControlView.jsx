// src/components/ControlView.jsx
// This is the component for a control input for the datapath view
import React, {Component} from 'react';

// This is passed:
//  x, y, wid
//  label
//  callback
//  buttonID
//  ctrlName
//  active (to control how it is displayed)
class ControlView extends Component
{
  constructor(props)
  {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick()
  {
    this.props.callback(this.props.buttonID, this.props.ctrlName);
  }

  render()
	{
    const {x, y, wid, label, active} = this.props;
    const hgt = 20;
    const offset = 4;
    const lx = x;
    const vx = lx + offset;
    const ly = y;
    const hy = y + hgt - offset;
    const color = active ? '#44ee44' : '#cceecc';
    const rectStyle = { fill:color, stroke_width:1, stroke:'#000' };
    const labelStyle = { fontFamily: 'Arial', fontSize: 16, fill: '#000', x: vx, y:hy };
		return (
		    <g>
          <rect style={rectStyle} x={lx} y={ly} width={wid} height={hgt} onClick={this.handleClick}/>
          <text {...labelStyle} onClick={this.handleClick}>{label}</text>
        </g> );
	}
};

export default ControlView;
