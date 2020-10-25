// This is the layout users should see if they don't want to look at the whole
// datapath and just want to prorgram the processor.

import React from 'react';
import style from './DatapathLayout.module.css';
import { Datapath, DatapathView } from '../logic/datapath';

type Props = {
  datapath: Datapath
};

type State = {}

export default class DatapathLayout extends React.Component<Props, State> {
  render()
  {
    const datapath = this.props.datapath;
    return (
      <DatapathView className={style.datapathView} datapath={datapath} />
    )
  }
}