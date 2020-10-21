import React from 'react';
import { Input, LogicComponent, Output } from "./component";
import { Bus } from './connections';
import { Datapath } from './Datapath';

export class Wire
{
  segments: Array<WireSegment>;

  constructor(private bus: Bus, pathDescription: string)
  {
    const builder = new SegmentsBuilder(bus);
    builder.parse(pathDescription);
    this.segments = builder.segments;
  }

  public render(k: string, d: Datapath)
  {
    return (<WireView key={k} c={this} d={d} />)
  }
}

class WireSegment
{
  constructor(
    public x1: number,
    public y1: number,
    public x2: number,
    public y2: number,
  ) { }
}

class SegmentsBuilder
{
  segments: Array<WireSegment> = [];

  constructor(private bus: Bus) { }

  private getInputPin(index: number): { x: number, y: number }
  {
    const result = this.bus.connectedInputPins[index];
    return {
      x: result.c.x + result.p.x,
      y: result.c.x + result.p.x
    };
  }

  private getOutputPin(index: number): { x: number, y: number }
  {
    const result = this.bus.connectedOutputPins[index];
    return {
      x: result.c.x + result.p.x,
      y: result.c.x + result.p.x
    };
  }

  private addSegment(x1: number, y1: number, x2: number, y2: number)
  {
    this.segments.push(new WireSegment(x1, y1, x2, y2));
  }

  private outputToInput(path: string)
  {
    const { x: x1, y: y1 } = this.getOutputPin(0);
    const { x: x2, y: y2 } = this.getInputPin(0);
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    switch (path)
    {
      case 'H':
        if (y1 !== y2)
        {
          throw new Error(`Emulator error: for wire, the connectors do not line up (${y1} vs ${y2}).`);
        }
        this.addSegment(x1, y1, x2, y2);
        break;
      case 'V':
        if (x1 !== x2)
        {
          throw new Error(`Emulator error: for wire, the connectors do not line up (${x1} vs ${x2}).`);
        }
        this.addSegment(x1, y1, x2, y2);
        break;
      case 'HV':
        this.addSegment(x1, y1, x2, y1);
        this.addSegment(x2, y1, x2, y2);
        break;
      case 'VH':
        this.addSegment(x1, y1, x1, y2);
        this.addSegment(x1, y2, x2, y2);
        break;
      case 'HVH':
        this.addSegment(x1, y1, cx, y1);
        this.addSegment(cx, y1, cx, y2);
        this.addSegment(cx, y2, x2, y2);
        break;
      case 'VHV':
        this.addSegment(x1, y1, x1, cy);
        this.addSegment(x1, cy, x2, cy);
        this.addSegment(x2, cy, x2, y2);
        break;
      default:
        break;
    }
  }

  parse(description: string)
  {
    const arr = description.split(' ');
    let x1: number = 0, y1: number = 0, x2: number = 0, y2: number = 0;
    let mode = 0;
    let idx;
    let stk = [];
    for (let i = 0; i < arr.length; i++)
    {
      let op = arr[i];
      if (op === 'H' || op === 'V' || op === 'HV' || op === 'VH' || op === 'HVH' || op === 'VHV')
      {
        // A normal single-wire connection.
        this.outputToInput(op);
        return;
      }

      // Move from p2 to p1
      x1 = x2;
      y1 = y2;

      let t, v;

      switch (op)
      {
        case 'i':
          // This should be followed by a number which is the input number,
          // followed by 'x', 'y', or 'xy'.
          idx = parseInt(arr[i + 1]);
          switch (arr[i + 2])
          {
            case 'x':
              x2 = this.getInputPin(idx).x;
              break;
            case 'y':
              y2 = this.getInputPin(idx).y;
              break;
            case 'xy':
              x2 = this.getInputPin(idx).x;
              y2 = this.getInputPin(idx).y;
              break;
            default:
              break;
          }
          i += 2;
          break;
        case 'o':
          // This should be followed by a number which is the output number,
          // followed by 'x', 'y', or 'xy'.
          idx = parseInt(arr[i + 1]);
          switch (arr[i + 2])
          {
            case 'x':
              x2 = this.getOutputPin(idx).x;
              break;
            case 'y':
              y2 = this.getOutputPin(idx).y;
              break;
            case 'xy':
              x2 = this.getOutputPin(idx).x;
              y2 = this.getOutputPin(idx).y;
              break;
            default:
              break;
          }
          i += 2;
          break;
        case 'l':
          // This is move left (relative)
          x2 -= parseInt(arr[i + 1]);
          i++;
          break;
        case 'r':
          // This is move right (relative)
          x2 += parseInt(arr[i + 1]);
          i++;
          break;
        case 'u':
          // This is move down (relative)
          y2 -= parseInt(arr[i + 1]);
          i++;
          break;
        case 'd':
          // This is move up (relative)
          y2 += parseInt(arr[i + 1]);
          i++;
          break;
        case '^':
          t = parseInt(arr[i + 1]);
          switch (arr[i + 2])
          {
            case 'x':
              stk[t] = { val: x2, isX: true };
              break;
            case 'y':
              stk[t] = { val: y2, isX: false };
              break;
            case 'xy':
              stk[t] = { val: x2, valy: y2 };
              break;
            default:
              break;
          }
          i += 2;
          continue;
        case '$':
          t = parseInt(arr[i + 1]);
          v = stk[t];
          if (v)
          {
            if (v.valy !== undefined)
            {
              x2 = v.val;
              y2 = v.valy;
            }
            else if (v.isX)
            {
              x2 = v.val;
            }
            else
            {
              y2 = v.val;
            }
          }
          i++;
          break;
        case 'X':
          // Move to in X
          x2 = parseInt(arr[i + 1]);
          i++;
          break;
        case 'Y':
          // Move to in Y
          y2 = parseInt(arr[i + 1]);
          i++;
          break;
        case ';':
          // Start a new segment
          x1 = 0;
          y1 = 0;
          x2 = 0;
          y2 = 0;
          mode = -1;
          break;
        default:
          break;
      }
      if (mode === 1)
      {
        this.addSegment(x1, y1, x2, y2);
        continue;
      }
      mode++;
    }
  }
}

class WireView extends React.Component<{ c: Wire, d: Datapath }>
{
  render()
  {
    let segments = [], i = 0;
    for (const seg of this.props.c.segments)
    {
      segments.push(<line key={i} {...seg}></line>);
      i++;
    }
    return (
      <g className="wire">
        {segments}
      </g>);
  }
};
