// This is the layout users should see if they don't want to look at the whole
// datapath and just want to prorgram the processor.

import React from 'react';
import MemoryGrid from './MemoryGrid';
import Pico from '../utils/PicoV3';
import style from './DatapathLayout.module.css';
import RegisterCell from './RegisterCell';
import FlagCell from './FlagCell';
import PicoReg from '../utils/PicoReg';
import csvio from '../utils/csvio';
import { Datapath, DatapathView } from '../logic/datapath';

type Props = {
  datapath: Datapath
};

type State = {}

export default class DatapathLayout extends React.Component<Props, State> {
  textBoxRef: React.RefObject<HTMLInputElement> = React.createRef();

  constructor(props: Props)
  {
    super(props);
  }

  render()
  {
    const datapath = this.props.datapath;
    return (
      <div className={style.root}>
        <DatapathView datapath={datapath} />
        <div className={style.actions}>
          <button className="flat-button" onClick={() => { datapath.clock(); datapath.eval(); }}>Clock</button>
          <button className="flat-button" onClick={() => {}}>Run</button>
          <button className="flat-button" onClick={() => {}}>Run Fast</button>
          <button className="flat-button" onClick={() => {}}>Stop</button>
          <button className="flat-button" onClick={() => { datapath.reset(); datapath.eval(); }}>Reset</button>
          {/* <button className="flat-button" onClick={saveFile}>Save Memory</button>
          <label className="flat-button" htmlFor="file">Load Memory</label>
          <input onChange={loadFile} id="file" type="file" accept=".csv" className={style.semi_hidden} /> */}
          <button className={'flat-button ' + style.switch_view_button}>Switch To Datapath View</button>
        </div>
      </div>
    )
  }
}