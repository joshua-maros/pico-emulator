// src/components/ProbeView.jsx
// This is the component for a Probe for the datapath view
import React, {Component} from 'react';
import Displayable from '../utils/Displayable'

// This is passed:
//  x, y, wid, value
class ProbeView extends Component
{
  render()
	{
    const {x, y, wid} = this.props;
    let value = Displayable(this.props.value);
    const xfrm = 'translate(' + x + ',' + y + ')';
    const lineStyle = { stroke_width:1, stroke:'#000' };
    const textStyle = { fontFamily: 'Arial', fontSize: 16, fill: '#000', x: 10, y:16 };
		return (
		    <g transform={xfrm}>
          <text key={1} {...textStyle}>{value}</text>
          <line key={3} x1={10} y1={0} x2={wid} y2={0} {...lineStyle}/>
          <line key={4} x1={10} y1={20} x2={wid} y2={20} {...lineStyle}/>
          <line key={5} x1={wid} y1={0} x2={wid} y2={20} {...lineStyle}/>
          <line key={6} x1={0} y1={10} x2={10} y2={0} {...lineStyle}/>
          <line key={7} x1={0} y1={10} x2={10} y2={20} {...lineStyle}/>
        </g> );
	}
};

export default ProbeView;
