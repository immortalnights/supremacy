import React from 'react'
import { useRecoilValue } from 'recoil'
import StarDate from '../../components/date'
import atoms from '../../state/atoms'

const ShipDetails = props => {
	const ship = useRecoilValue(atoms.ships(props.ship ? props.ship.id : null))
	const planet = useRecoilValue(atoms.planets(props.planet))

	const details = {
		name: '',
		civilians: planet.population, // on the planet
		seats: '',
		crew: '',
		requiredCrew: '',
		capacity: '',
		maximumFuel: '',
		payload: '',
		value: '',
	}

	if (ship)
	{
		details.name = ship.name
		details.seats = ship.capacity.civilians
		details.crew = ship.crew
		details.requiredCrew = ship.requiredCrew
		details.capacity = ship.capacity.cargo
		details.maximumFuel = ship.maximumFuel
		details.payload = 0
		details.value = ship.value
	}

	return (
		<dl>
			<dt>Ship</dt>
			<dd>{details.name}</dd>
			<dt>Civilians</dt>
			<dd>{details.civilians}</dd>
			<dt>Seats</dt>
			<dd>{details.seats}</dd>
			<dt>Crew</dt>
			<dd>{ship ? (details.crew + ' / ' + details.requiredCrew) : ''}</dd>
			<dt>Capacity</dt>
			<dd>{details.capacity}</dd>
			<dt>Max Fuel</dt>
			<dd>{details.maximumFuel}</dd>
			<dt>Payload</dt>
			<dd>{details.payload}</dd>
			<dt>Value</dt>
			<dd>{details.value}</dd>
		</dl>
	)
}

export default ShipDetails