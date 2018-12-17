import React from 'react';

const Block = (props) => {
	let x='0';
	if(props.keyPressed==='left')		
		x='-'+props.translate;
	else if(props.keyPressed==='right')
		x=props.translate;
	let y='0';
	if(props.keyPressed==='up')		
		y='-'+props.translate;
	else if(props.keyPressed==='down')
		y=props.translate;
	let animStyle={ opacity:'1', transition: `${props.time}s ease-out`, transform:`translate(${x}%,${y}%)`};
	if(props.anim===0)
		delete animStyle.transition;
	if(props.value===0)
		animStyle.opacity='0';
	return (
	<div className="block" style={animStyle}>
		<span className="block-number">{(props.value===0)?'':props.value}</span>
	</div>
)}
export default Block;