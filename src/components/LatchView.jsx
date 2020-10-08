// src/components/LatchView.jsx
// This is the component for a Latch for the datapath view
import React, {Component} from 'react';
import Displayable from '../utils/Displayable';

// This is passed:
//  x, y, value, value2 (optional), label (optional)
class LatchView extends Component
{
  constructor(props)
  {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick()
  {
    this.props.callback();
  }

  render()
	{
    const {x, y, label} = this.props;
    const value = Displayable(this.props.value);
    const value2 = this.props.value2;
    const xfrm = 'translate(' + x + ',' + y + ')';
    const lineStyle = { fill:'#FFFFFF', stroke_width:1, stroke:'#000' };
    const labelStyle = { fontFamily: 'Arial', fontSize: 12, fill: '#000', x: 15, y:23, textAnchor:'middle' };
    const valueStyle = { fontFamily: 'Arial', fontSize: 12, fill: '#0000FF', x: 33, y:7 };
    const value2Style = { fontFamily: 'Arial', fontSize: 12, fill: '#0000FF', x: 33, y:-3 };
    let items = [];
    let v1 = <text key={1} {...valueStyle}>{value}</text>;
    items.push(v1);
    if (value2 !== null)
    {
      items.push(<text key={8} {...value2Style}>{value2}</text>);
    }
    if (label !== null)
    {
      let v2 = <text key={7} {...labelStyle}>{label}</text>;
      items.push(v2);
    }
		return (
		    <g transform={xfrm}>
          <rect key={3} style={lineStyle} x={0} y={0} width={30} height={50} onClick={this.handleClick}/>
          {items}
        </g> );
	}
};

export default LatchView;
