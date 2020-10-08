// src/components/MemoryView.jsx
// This is the component for viewing a PicoMemory
import React, {Component} from 'react';

// This is passed:
//  key
//  x, y
//  label
//  length
//  arr
//  green, blue, red, yellow
class MemoryView extends Component
{
  constructor(props)
  {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  makeHLine(idx, x0, x1, y)
  {
    const lineStyle = { stroke_width:1, stroke:'#000' };
    return (
      <line key={idx} x1={x0} y1={y} x2={x1} y2={y} style={lineStyle} />
    );
  }

  makeVLine(idx, x, y0, y1)
  {
    const lineStyle = { stroke_width:1, stroke:'#000' };
    return (
      <line key={idx} x1={x} y1={y0} x2={x} y2={y1} style={lineStyle} />
    );
  }

  handleClick(event)
  {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const {x, y, length} = this.props;
    const dx = (length > 100) ? 80 : 100;
    const dy = (length > 100) ? 16 : 20;
    const idx = Math.floor((mouseX - x) / dx) * 32 + Math.floor((mouseY - y) / dy);
    this.props.callback(idx);
  }

  makeHighlight(idx, loc, color)
  {
    let clr = '#ffff88';
    switch (color)
    {
      case 1: // green
        clr = '#88ee88';
        break;
      case 2: // blue
        clr = '#8888ff';
        break;
      case 3: // red
        clr = '#ff8888';
        break;
      default:
        break;
    }
    const {x, y} = this.props;
    const dx = 80;
    const dy = 16;
    const row = loc & 31;
    const col = (loc - row) / 32;
    const x0 = x + col * dx;
    const y0 = y + row * dy;
    const rectStyle = { fill:clr };
    return (<rect key={idx} style={rectStyle} x={x0} y={y0} width={dx} height={dy} onClick={this.handleClick}/>);
  }

  render()
	{
    const {x, y, label, length, arr} = this.props;
    // If length == 128, this is the full memory.
    // If length is much smaller, this is a register array.
    const dx = (length > 100) ? 80 : 100;
    const dy = (length > 100) ? 16 : 20;
    const offset = 4;
    const x0 = x;
    const x1 = x0 + ((length > 100) ? 4 : 1) * dx;
    const y0 = y;
    const y1 = y0 + ((length > 100) ? 32 : length) * dy;
    const tSize = (length > 100) ? 12 : 16;
    const labX = x0 - offset;
    const labX1 = labX - ((length > 100) ? 15 : 0);
    const labY = y0 + dy - offset;
    const bgcolor = this.props.yellow ? '#FFFF22' : '#FFFFDD';
    const rectStyle = { fill:bgcolor, stroke_width:1, stroke:'#000' };
    const labelStyle = { fontFamily: 'Arial', fontSize: 16, fill: '#000', x: labX1, y:labY, textAnchor: 'end' };
    let list = [];
    let cntr = 1;
    if (length > 100)
    {
      if (this.props.green >= 0)
      {
        list.push(this.makeHighlight(cntr++, this.props.green, 1));
      }
      if (this.props.blue >= 0)
      {
        list.push(this.makeHighlight(cntr++, this.props.blue, 2));
      }
      if (this.props.red >= 0)
      {
        list.push(this.makeHighlight(cntr++, this.props.red, 3));
      }
      for (let i = 1; i < 32; i++)
      {
        let y = y0 + i * dy;
        list.push(this.makeHLine(cntr++, x0, x1, y));
      }
      for (let i = 1; i < 4; i++)
      {
        let x = x0 + i * dx;
        list.push(this.makeVLine(cntr++, x, y0, y1));
      }
      for (let i = 0; i < 32; i++)
      {
        let y = y0 + i * dy + dy - offset;
        let txtStyle = { fontFamily: 'Arial', fontSize:tSize, textAnchor: 'end', x: labX, y: y, wid: dx, hgt:dy};
        list.push(<text key={cntr++} {...txtStyle}>{i}</text>);
      }
      for (let j = 0; j < 4; j++)
      {
        let x = x0 + j * dx + dx - offset;
        for (let i = 0; i < 32; i++)
        {
          let y = y0 + i * dy + dy - offset;
          let idx = 32 * j + i;
          let txtStyle = { fontFamily: 'Arial', fontSize:tSize, textAnchor: 'end', x: x, y: y};
          list.push(<text key={cntr++} {...txtStyle} onClick={this.handleClick}>{arr[idx]}</text>);
        }
      }
    }
    else
    {
      for (let i = 1; i < length; i++)
      {
        let y = y0 + i * dy;
        list.push(this.makeHLine(cntr++, x0, x1, y));
      }
      for (let i = 0; i < length; i++)
      {
        let x = x1 - offset;
        let y = y0 + i * dy + dy - offset;
        let txtStyle = { fontFamily: 'Arial', fontSize:tSize, textAnchor: 'end', x: x, y: y};
        list.push(<text key={cntr++} {...txtStyle}>{arr[i]}</text>);
      }
    }
		return (
		    <g>
          <rect key={cntr++} style={rectStyle} x={x0} y={y0} width={x1 - x0} height={y1 - y0} onClick={this.handleClick}/>
          <text key={cntr++} {...labelStyle}>{label}</text>
          {list}
        </g> );
	}
};

export default MemoryView;
