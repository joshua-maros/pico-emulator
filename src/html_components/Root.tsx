import React from 'react';
import { Datapath } from '../logic/datapath';
import DatapathLayout from './DatapathLayout';
import ProgrammerLayout from './ProgrammerLayout';
import style from './Root.module.css';
import csvio from '../utils/csvio';

export default class Root extends React.Component<{ datapath: Datapath }, { datapathLayout: boolean }> {
  constructor(props: { datapath: Datapath })
  {
    super(props);
    this.state = {
      datapathLayout: false,
    }
  }

  componentDidMount()
  {
    this.props.datapath.changeListener = () => this.forceUpdate();
  }

  componentWillUnmount()
  {
    this.props.datapath.changeListener = () => { };
  }

  private loadFile(event: React.ChangeEvent<HTMLInputElement>)
  {
    const file = event.target.files?.item(0);
    if (!file) return;
    file.text().then((text: string) =>
    {
      const datapath = this.props.datapath;
      const error = csvio.loadMem(datapath.mainMemoryBlock, text);
      this.forceUpdate();
      if (error)
      {
        alert('Error encountered while loading file:\n' + error);
      }
      this.props.datapath.eval();
    });
  }

  private saveFile()
  {
    const datapath = this.props.datapath;
    const contents = csvio.saveMem(datapath.mainMemoryBlock);
    const blob = new Blob([contents]);
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'Memory.csv';
    link.type = 'text/csv';
    link.href = href;
    link.click();
    link.remove();
    this.props.datapath.eval();
  }

  private toggleLayout()
  {
    this.setState(state => ({ datapathLayout: !state.datapathLayout }));
  }

  render()
  {
    const datapath = this.props.datapath;
    const mainWidget = this.state.datapathLayout
      ? (<DatapathLayout datapath={datapath} />)
      : (<ProgrammerLayout datapath={datapath} />);
    return (
      <div className={style.root}>
        {mainWidget}
        <div className={datapath.lastMessageWasError ? style.error_message : style.info_message}>
          {datapath.lastMessage}
        </div>
        <div className={style.actions}>
          <button className="flat-button" onClick={() => datapath.step()}>
            {this.state.datapathLayout ? 'Clock' : 'Step'}
          </button>
          <button className="flat-button" onClick={() => datapath.startRunning(false)}>Run</button>
          <button className="flat-button" onClick={() => datapath.startRunning(true)}>Run Fast</button>
          <button className="flat-button" onClick={() => datapath.halt()}>Stop</button>
          <button className="flat-button" onClick={() => datapath.reset()}>Reset</button>
          <button className="flat-button" onClick={() => this.saveFile()}>Save Memory</button>
          <label className="flat-button" htmlFor="file">Load Memory</label>
          <input onChange={e => this.loadFile(e)} id="file" type="file" accept=".csv" className={style.semi_hidden} />
          <button
            className={'flat-button ' + style.switch_view_button}
            onClick={() => this.toggleLayout()}>
            Switch To {this.state.datapathLayout ? 'Programmer' : 'Datapath'} View
          </button>
        </div>
      </div>
    );
  }
}