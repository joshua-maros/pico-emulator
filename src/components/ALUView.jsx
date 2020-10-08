// src/components/ALUView.jsx
// This is the component for the ALU for the datapath view
import React, {Component} from 'react';

// This is passed:
//  x, y
class ALUView extends Component
{
  render()
	{
    const {x, y} = this.props;
    const xfrm = 'translate(' + x + ',' + y + ')';
    const lineStyle = { fill:'#FFFFFF', stroke_width:1, stroke:'#000000' };
		return (
		    <g transform={xfrm}>
          <path d='M0 0 L40 20 V60 L0 80 V50 L20 40 L0 30 Z' {...lineStyle}/>
        </g> );
	}
};

export default ALUView;
