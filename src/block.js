import React from 'react';

const Block = (props) => {
	let x='';
	if(props.keyPressed==='left')		
		x='-'+props.translate;
	else if(props.keyPressed==='right')
		x=props.translate;
	else
		x='0';
	let y='';
	if(props.keyPressed==='up')		
		y='-'+props.translate;
	else if(props.keyPressed==='down')
		y=props.translate;
	else
		y='0';
	let animStyle={ transition: '0.2s ease-out', transform:`translate(${x}%,${y}%)`};
	if(props.anim===0)
		delete animStyle.transition;
	return (
	<div className="block" style={animStyle}>
		<span className="block-number">{(props.value===0)?'':props.value}</span>
	</div>
)}
export default Block;