// src/components/MuxView.jsx
// This is the component for a Mux for the datapath view
import React, {Component} from 'react';

// This is passed:
//  x, y
class MuxView extends Component
{
  render()
	{
    const {x, y} = this.props;
    const xfrm = 'translate(' + x + ',' + y + ')';
    const lineStyle = { stroke_width:1, stroke:'#000' };
    const labelStyle0 = { fontFamily: 'Arial', fontSize: 12, fill: '#000', x: 3, y:16 };
    const labelStyle1 = { fontFamily: 'Arial', fontSize: 12, fill: '#000', x: 3, y:46 };
		return (
		    <g transform={xfrm}>
          <text key={1} {...labelStyle0}>0</text>
          <text key={2} {...labelStyle1}>1</text>
          <line key={3} x1={0} y1={0} x2={0} y2={50} {...lineStyle}/>
          <line key={4} x1={0} y1={0} x2={20} y2={10} {...lineStyle}/>
          <line key={5} x1={0} y1={50} x2={20} y2={40} {...lineStyle}/>
          <line key={6} x1={20} y1={10} x2={20} y2={40} {...lineStyle}/>
        </g> );
	}
};

export default MuxView;
