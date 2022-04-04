import React from 'react'
import { useRecoilValue } from 'recoil'
import store from '../../state/atoms'
import { DateDisplay } from '../../components/date'

const ShipHeading = props => {
	const ship = useRecoilValue(store.ships(props.ship ? props.ship.id : null))
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
				<dd><DateDisplay date={heading.arrival} /></dd>
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