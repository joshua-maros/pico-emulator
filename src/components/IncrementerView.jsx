// src/components/IncrementerView.jsx
// This is the component for a Latch for the datapath view
import React, {Component} from 'react';
import Displayable from '../utils/Displayable';

// This is passed:
//  x, y, constant, value
class IncrementerView extends Component
{
  render()
	{
    const {x, y, constant} = this.props;
    const value = Displayable(this.props.value);
    const xfrm = 'translate(' + x + ',' + y + ')';
    const lineStyle = { fill:'#FFFFFF', stroke_width:1, stroke:'#000000' };
    const labelStyle = { fontFamily: 'Arial', fontSize: 14, fill: '#000000', x: 15, y:20, textAnchor:'middle' };
    const valueStyle = { fontFamily: 'Arial', fontSize: 12, fill: '#0000FF', x: 33, y:12 };
    const label = ((constant >= 0) ? '+' : '' ) + constant ;
		return (
		    <g transform={xfrm}>
          <circle key={3} cx={15} cy={15} r={15} {...lineStyle}/>
          <text key={1} {...labelStyle}>{label}</text>
          <text key={2} {...valueStyle}>{value}</text>
        </g> );
	}
};

export default IncrementerView;
