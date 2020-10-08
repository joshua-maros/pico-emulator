// src/components/WireView.jsx
// This draws a wire (bus) for the datapath view
import React, {Component} from 'react';

// This is passed:
//  value, segments, (optional:) label, x, y
class WireView extends Component
{
  render()
	{
    const {value, segments, label, x, y} = this.props;
    let lineStyle = { strokeWidth:3, stroke:'#5555FF' };
    let line2Style = { strokeWidth:5, stroke:'#000000' };
    if (value === 'Conflict')
    {
      lineStyle = { strokeWidth:3, stroke:'#FF2222' };
      line2Style = { strokeWidth:3, stroke:'#FF2222' };
    }
    else if (value === 'Unknown')
    {
      lineStyle = { strokeWidth:3, stroke:'#FFFF22' };
      line2Style = { strokeWidth:3, stroke:'#FFFF22' };
    }
    else if (value === false || value === 'none')
    {
      lineStyle = { strokeWidth:1, stroke:'#444444' };
      line2Style = { strokeWidth:1, stroke:'#444444' };
    }
    let contents = [];
    for (let i = 0; i < segments.length; i++)
    {
      const seg = segments[i];
      if (seg.used)
      {
        contents.push(<line key={i} {...seg} {...line2Style}/>);
      }
      else
      {
        contents.push(<line key={i} {...seg} {...lineStyle}/>);
      }
    }
    if (label !== null && label !== undefined)
    {
      const labelStyle = { fontFamily: 'Arial', fontSize: 12, fill: '#000', x:x, y:y };
      let v2 = <text key={999} {...labelStyle}>{label}</text>;
      contents.push(v2);
    }
		return (
		    <g>
          {contents}
        </g> );
	}
};

export default WireView;
