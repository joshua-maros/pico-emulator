// src/components/AndView.jsx
// This is the component for an AND gate for the datapath view
import React, {Component} from 'react';

// This is passed:
//  x, y
class AndView extends Component
{
  render()
	{
    const {x, y} = this.props;
    const xfrm = 'translate(' + x + ',' + y + ')';
    const lineStyle = { fill:'#FFFFFF', stroke_width:1, stroke:'#000000' };
		return (
		    <g transform={xfrm}>
          <path d='M0 0 H10 A10 10 0 0 1 10 20 H 0 Z' {...lineStyle}/>
        </g> );
	}
};

export default AndView;
