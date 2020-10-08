// src/components/MessageView.jsx
// This is the component for viewing a Message
import React, {Component} from 'react';

// This is passed:
//  key
//  x, y, wid
//  err
//  message
class MessageView extends Component
{
  render()
	{
    const {x, y, wid, err, message} = this.props;
    const hgt = 20;
    const offset = 4;
    const lx = x;
    const vx = lx + offset;
    const ly = y;
    const hy = y + hgt - offset;
    let color = '#aaaaff';
    if (message.length > 1)
    {
      color = err ? '#ff8888' : '#88ee88';
    }
    const rectStyle = { fill:color, stroke_width:1, stroke:'#000' };
    const messageStyle = { fontFamily: 'Arial', fontSize: 16, fill: '#000', x: vx, y:hy, textAnchor: 'start' };
		return (
		    <g>
          <rect style={rectStyle} x={lx} y={ly} width={wid} height={hgt}/>
          <text {...messageStyle}>{message}</text>
        </g> );
	}
};

export default MessageView;
