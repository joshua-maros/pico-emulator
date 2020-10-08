// src/components/OrView.jsx
// This is the component for an OR for the datapath view
import React, {Component} from 'react';

// This is passed:
//  x, y
class OrView extends Component
{
  render()
	{
    const {x, y} = this.props;
    const xfrm = 'translate(' + x + ',' + y + ')';
    const lineStyle = { fill:'#FFFFFF', stroke_width:1, stroke:'#000000' };
		return (
		    <g transform={xfrm}>
          <path d='M-3.7 0 A33 33 0 0 1 20 10 A33 33 0 0 1 -3.7 20 A13 13 0 0 0 -3.7 0 Z' {...lineStyle}/>
        </g> );
	}
};

export default OrView;
