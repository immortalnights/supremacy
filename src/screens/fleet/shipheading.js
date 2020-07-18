import React from 'react'
import { useRecoilValue } from 'recoil'
import atoms from '../../state/atoms'

const ShipHeading = props => {
	const ship = useRecoilValue(atoms.ships(props.ship ? props.ship.id : null))
	let content

	if (ship && ship.heading)
	{
		const heading = ship.heading
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