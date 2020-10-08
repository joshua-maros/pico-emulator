// src/components/FlagLogicView.jsx
// This is the component for the Flag Logic for the datapath view
import React, {Component} from 'react';

// This is passed:
//  x, y, inVal, outVal
class FlagLogicView extends Component
{
  flagChar(val, shift)
  {
    const tmp = (val >> shift) & 3;
    switch (tmp)
    {
      case 0: return 'F';
      default:
      case 1: return '?';
      case 2: return 'T';
    }
  }

  render()
	{
    const {x, y, inVal, outVal} = this.props;
    const xfrm = 'translate(' + x + ',' + y + ')';
    const outStr = this.flagChar(outVal, 8) + ' ' + this.flagChar(outVal, 6) + ' ' +
      this.flagChar(outVal, 4) + ' ' + this.flagChar(outVal, 2) + ' ' + this.flagChar(outVal, 0);
    const inStr = this.flagChar(inVal, 8) + ' ' + this.flagChar(inVal, 6) + ' ' +
      this.flagChar(inVal, 4) + ' ' + this.flagChar(inVal, 2) + ' ' + this.flagChar(inVal, 0);
    const lineStyle = { fill:'#FFFFFF', stroke_width:1, stroke:'#000000' };
    const label0Style = { fontFamily: 'Lucida Console, Monaco, monospace', fontSize: 10, fill: '#000', x: 30, y:10, textAnchor:'middle' };
    const label1Style = { fontFamily: 'Lucida Console, Monaco, monospace', fontSize: 10, fill: '#000', x: 30, y:19, textAnchor:'middle' };
    const label2Style = { fontFamily: 'Lucida Console, Monaco, monospace', fontSize: 10, fill: '#000', x: 30, y:28, textAnchor:'middle' };
		return (
		    <g transform={xfrm}>
          <path d='M0 0 H 60 V 30 H 0 Z' {...lineStyle}/>
          <text key={1} {...label1Style}>T V C Z N</text>
          <text key={2} {...label0Style}>{outStr}</text>
          <text key={3} {...label2Style}>{inStr}</text>
        </g> );
	}
};

export default FlagLogicView;
