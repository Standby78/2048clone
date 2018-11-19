import React from 'react';

const Block = (props) => (
	<div className="block" style={{transform:`translate(0px,-${props.translate}%)`}}>
		<span className="block-number">{(props.value===0)?'':props.value}</span>
	</div>
)
export default Block;