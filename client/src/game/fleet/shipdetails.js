import React from 'react'
import { useRecoilValue } from 'recoil'
import StarDate from '../../components/date'
import atoms from '../../state/atoms'

const ShipDetails = props => {
	const ship = useRecoilValue(atoms.ships(props.ship ? props.ship.id : null))

	return (
		<dl>
			<dt>Ship</dt>
			<dd>{ship ? ship.name : ''}</dd>
			<dt>Date</dt>
			<dd><StarDate /></dd>
			<dt>Class</dt>
			<dd>{ship ? ship.type : ''}</dd>
			<dt>Crew</dt>
			<dd>{ship ? ship.crew : ''}</dd>
			<dt>Fuel</dt>
			<dd>{ship ? ship.fuel : ''}</dd>
		</dl>
	)
}

export default ShipDetails