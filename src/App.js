// src/App.js

import React, {Component} from 'react';
import ProcView from './components/ProcView';

class App extends Component
{
  constructor(props)
	{
		super(props);
		this.state = {processor: this.props.processor,
                  wid: this.props.processor.viewWid,
                  hgt: this.props.processor.viewHgt};
	}

  onProcessorUpdate()
	{
		this.setState({processor: this.props.processor,
      wid: this.props.processor.viewWid,
      hgt: this.props.processor.viewHgt});
	}

  render()
	{
		const processor = this.state.processor;
		return (
				<div>
					<ProcView processor={processor}
            viewWid={processor.viewWid}
            viewHgt={processor.viewHgt}
						onUpdate={this.onProcessorUpdate.bind(this)} />
				</div>
			)
	}
}

export default App;
