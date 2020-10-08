// src/components/TristateView.jsx
// This is the component for a Tristate Driver for the datapath view
import React, {Component} from 'react';

// This is passed:
//  x, y, flip
class TristateView extends Component
{
  render()
	{
    const {x, y, flip} = this.props;
    const xfrm = 'translate(' + x + ',' + y + ')';
    const lineStyle = { stroke_width:1, stroke:'#000' };
    const x0 = flip ? 30 : 0;
    const x1 = 30 - x0;
		return (
		    <g transform={xfrm}>
          <line key={3} x1={x0} y1={0} x2={x0} y2={40} {...lineStyle}/>
          <line key={4} x1={x0} y1={0} x2={x1} y2={20} {...lineStyle}/>
          <line key={5} x1={x0} y1={40} x2={x1} y2={20} {...lineStyle}/>
        </g> );
	}
};

export default TristateView;
