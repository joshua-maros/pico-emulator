// src/components/FlagView.jsx
// This is the component for viewing a PicoReg
import React, {Component} from 'react';

// This is passed:
//  key
//  x, y
//  label
//  value
class FlagView extends Component
{
  render()
	{
    const {x, y, label, value} = this.props;
    const wid = 20;
    const hgt = 20;
    const offset = 4;
    const lx = x;
    const vx = lx + wid - offset;
    const ly = y;
    const hy = y + hgt - offset;
    const lablx = lx - offset;
    const rectStyle = { fill:'#ffffdd', stroke_width:1, stroke:'#000' };
    const labelStyle = { fontFamily: 'Arial', fontSize: 16, fill: '#000', x: lablx, y:hy, textAnchor: 'end' };
    const valueStyle = { fontFamily: 'Arial', fontSize: 16, fill: '#000', x: vx, y:hy, textAnchor: 'end' };
		return (
		    <g>
          <rect style={rectStyle} x={lx} y={ly} width={wid} height={hgt}/>
          <text {...labelStyle}>{label}</text>
          <text {...valueStyle}>{value ? 'T' : 'F'}</text>
        </g> );
	}
};

export default FlagView;
