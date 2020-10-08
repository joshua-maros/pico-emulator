// src/components/DecoderView.jsx
// This is the component for the Decoder for the datapath view
import React, {Component} from 'react';

// This is passed:
//  x, y, status
class DecoderView extends Component
{
  render()
	{
    const {x, y, status} = this.props;
    const xfrm = 'translate(' + x + ',' + y + ')';
    const lineStyle = { fill:'#FFFFFF', stroke_width:1, stroke:'#000000' };
    const labelStyle = { fontFamily: 'Arial', fontSize: 12, fill: '#000000', x: 25, y:20, textAnchor:'middle' };
    const statusStyle = { fontFamily: 'Arial', fontSize: 12, fill: '#0000FF', x: 0, y:42 };
		return (
		    <g transform={xfrm}>
          <path key={3} d='M0 0 H 50 V 30 H 0 Z' {...lineStyle}/>
          <text key={1} {...labelStyle}>decoder</text>
          <text key={2} {...statusStyle}>{status}</text>
        </g> );
	}
};

export default DecoderView;
