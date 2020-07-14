import React from 'react'

const ShipHeading = props => {
	const values = {
		name: '',
		from: '',
		to: '',
		eda: '',
		fuel: '',
	}

	if (props.ship && props.ship.heading)
	{
		values.name = props.ship.name
		values.from = props.ship.heading.from
		values.to = props.ship.heading.to
		values.etd = props.ship.heading.eda
		values.fuel = props.ship.fuel
	}

	return (
		<div>
			<label>Heading</label>
			<dl>
				<dd>{values.name}</dd>
				<dt>Ship</dt>
				<dd>{values.from}</dd>
				<dt>From</dt>
				<dd>{values.to}</dd>
				<dt>To</dt>
				<dd>{values.eda}</dd>
				<dt>EDA</dt>
				<dd>{values.fuel}</dd>
				<dt>Fuel</dt>
			</dl>
		</div>
	)
}

export default ShipHeading