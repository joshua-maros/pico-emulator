// src/components/ExpandView.jsx
// This is the component for an Expander/Reducer for the datapath view
import React, {Component} from 'react';

// This is passed:
//  x, y
class ExpandView extends Component
{
  render()
	{
    const {x, y} = this.props;
    const xfrm = 'translate(' + x + ',' + y + ')';
    const lineStyle = { stroke_width:1, stroke:'#000' };
		return (
		    <g transform={xfrm}>
          <line key={3} x1={0} y1={10} x2={0} y2={40} {...lineStyle}/>
          <line key={4} x1={0} y1={10} x2={20} y2={0} {...lineStyle}/>
          <line key={5} x1={0} y1={40} x2={20} y2={50} {...lineStyle}/>
          <line key={6} x1={20} y1={0} x2={20} y2={50} {...lineStyle}/>
        </g> );
	}
};

export default ExpandView;
