import React from 'react'
import { useRecoilValue } from 'recoil'
import atoms from '../../state/atoms'

const ShipDetails = props => {
	const ship = useRecoilValue(atoms.ships(props.ship ? props.ship.id : null))
	const planet = useRecoilValue(atoms.planets(props.planet))

	const details = {
		name: '',
		civilians: planet.population, // on the planet
		seats: 0,
		crew: 0,
		requiredCrew: 0,
		crewText: '',
		capacity: null,
		payload: null,
		value: 0
	}

	if (ship)
	{
		details.name = ship.name
		details.crew = ship.crew
		details.requiredCrew = ship.requiredCrew
		details.capacity = { ...ship.capacity }
		details.payload = Object.keys(ship.cargo).reduce((mem, key) => (mem + ship.cargo[key]), 0)
		details.value = ship.value

		if (ship.requiredCrew > 0)
		{
			details.crewText = details.crew + ' / ' + details.requiredCrew
		}
		else
		{
			details.crewText = 'remote'
		}
	}

	return (
		<dl>
			<dt>Ship</dt>
			<dd>{details.name}</dd>
			<dt>Civilians</dt>
			<dd>{details.civilians.toFixed(0)}</dd>
			<dt>Seats</dt>
			<dd>{details.capacity ? details.capacity.seats : 0}</dd>
			<dt>Crew</dt>
			<dd>{details.crewText}</dd>
			<dt>Capacity</dt>
			<dd>{details.capacity ? details.capacity.cargo : 0}</dd>
			<dt>Max Fuel</dt>
			<dd>{details.capacity ? details.capacity.fuel : "Nuclear"}</dd>
			<dt>Payload</dt>
			<dd>{details.payload}</dd>
			<dt>Value</dt>
			<dd>{details.value}</dd>
		</dl>
	)
}

export default ShipDetails