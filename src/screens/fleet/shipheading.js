import React from 'react'

const ShipHeading = props => {
	let content

	if (props.ship && props.ship.heading)
	{
		const heading = props.ship.heading
		content = (
			<dl>
				<dt>Ship</dt>
				<dd>{props.ship.name}</dd>
				<dt>From</dt>
				<dd>{heading.from.name}</dd>
				<dt>To</dt>
				<dd>{heading.to.name}</dd>
				<dt>EDA</dt>
				<dd>{heading.arrival.m} / {heading.arrival.y}</dd>
				<dt>Fuel</dt>
				<dd>{heading.fuel}</dd>
			</dl>
		)
	}

	return (
		<div>
			<label>Heading</label>
			{content ? content : (<div>-</div>)}
		</div>
	)
}

export default ShipHeading