// src/components/AndOrView.jsx
// This is the component for an AND-OR gate for the datapath view
import React, {Component} from 'react';

// This is passed:
//  x, y
class AndOrView extends Component
{
  render()
	{
    const {x, y} = this.props;
    const xfrm = 'translate(' + x + ',' + y + ')';
    const lineStyle = { fill:'#FFFFFF', stroke_width:1, stroke:'#000000' };
		return (
		    <g transform={xfrm}>
          <path key={2} d='M16.3 0 A33 33 0 0 1 40 10 A33 33 0 0 1 16.3 20 A13 13 0 0 0 16.3 0 Z' {...lineStyle}/>
          <path key={1} d='M0 10 H10 A10 10 0 0 1 10 30 H 0 Z' {...lineStyle}/>
        </g> );
	}
};

export default AndOrView;
