// src/components/ProcView.jsx

import React, {Component} from 'react';
import ButtonView from '../components/ButtonView';

const ProcViewButtonHandler = (processor, buttonID) =>
	{
    // This should only be handling the 'clear errors' button
		processor.clear_errors();
		processor.rebuild();
	};

class ProcView extends Component
{
	renderNoErrors()
	{
		let list = [];
		let extras = [];
		const viewWid = this.props.processor.viewWid;
		const viewHgt = this.props.processor.viewHgt;
		this.props.processor.implement(list);
		this.props.processor.implementExtras(extras);
		this.props.processor.set_rebuild(this.props.onUpdate);
		const viewBox = [0, 0, viewWid, viewHgt];
		const procStyle = { width:viewWid, height:viewHgt };
		return (
			<div key={1}>
				<svg id="proc" style={procStyle} viewBox={viewBox}>
					{list}
				</svg>
				{extras}
			</div>
			);
	}

	renderErrors()
	{
		let i = 2;
		return (
			<div key={2}>
		    {this.props.processor.errors.map(msg => ( <p key={i++}>{msg}</p> ))}
				<svg key={1}>
					<ButtonView x={0} y={0} wid={100} label='Clear' callback={ProcViewButtonHandler.bind(this, this.props.processor, 1)} />
				</svg>
		  </div>
		);
	}

	render()
	{
		if (this.props.processor.prebuild)
		{
			this.props.processor.prebuild();
		}
		let hasErr = this.props.processor.has_errors();
		return (
			<div>
				{this.renderNoErrors()}
				{hasErr && this.renderErrors()}
			</div>
		);
	}
};

export default ProcView;
