import React from 'react'
import { useRecoilValue } from 'recoil'
import atoms from '../../state/atoms'

const ShipDetails = props => {
	const ship = useRecoilValue(atoms.ships(props.ship ? props.ship.id : null))
	const planet = useRecoilValue(atoms.planets(props.planet))

	const details = {
		name: "-",
		civilians: planet.population, // on the planet
		seats: "-",
		crew: "-",
		requiredCrew: null,
		crewText: "-",
		capacity: {
			civilians: "-",
			cargo: "-"
		},
		maxFuel: "-",
		payload: "-",
		value: "-"
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

		details.maxFuel = details.capacity ? details.capacity.fuel : "Nuclear"
	}

	return (
		<dl>
			<dt>Ship</dt>
			<dd>{details.name}</dd>
			<dt>Civilians</dt>
			<dd>{details.civilians.toFixed(0)}</dd>
			<dt>Seats</dt>
			<dd>{details.capacity.civilians}</dd>
			<dt>Crew</dt>
			<dd>{details.crewText}</dd>
			<dt>Capacity</dt>
			<dd>{details.capacity.cargo}</dd>
			<dt>Max Fuel</dt>
			<dd>{details.maxFuel}</dd>
			<dt>Payload</dt>
			<dd>{details.payload}</dd>
			<dt>Value</dt>
			<dd>{details.value}</dd>
		</dl>
	)
}

export default ShipDetails