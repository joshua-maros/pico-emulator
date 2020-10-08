// src/components/ButtonView.jsx
// This is the component for viewing a PicoReg
import React, {Component} from 'react';

// This is passed:
//  mykey
//  x, y, wid
//  label
//  callback
class ButtonView extends Component
{
  constructor(props)
  {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event)
  {
    this.props.callback();
    event.preventDefault();
  }

  render()
	{
    const {x, y, wid, label} = this.props;
    const hgt = 20;
    const offset = 4;
    const lx = x;
    const vx = lx + offset;
    const ly = y;
    const hy = y + hgt - offset;
    const rectStyle = { fill:'#8888ff', stroke_width:1, stroke:'#000' };
    const labelStyle = { fontFamily: 'Arial', fontSize: 16, fill: '#000', x: vx, y:hy };
		return (
		    <g>
          <rect style={rectStyle} x={lx} y={ly} width={wid} height={hgt} onClick={this.handleClick}/>
          <text {...labelStyle} onClick={this.handleClick}>{label}</text>
        </g> );
	}
};

export default ButtonView;
