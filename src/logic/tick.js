import React, { useEffect } from 'react'
import { useRecoilValue, useRecoilCallback } from 'recoil'
import atoms from '../state/atoms'

const updateDate = (date, set) => {
	if (date.m === 60)
	{
		date.y = date.y + 1
		date.m = 1
	}
	else
	{
		date.m = date.m + 1
	}

	set(atoms.date, date)

	return date
}

const updateShip = (id, snapshot, date, set) => {
	let ship = snapshot.getLoadable(atoms.ships(id)).contents

	if (ship.heading)
	{
		if (ship.heading.arrival.m === date.m && ship.heading.arrival.y === date.y)
		{
			console.log(`Ship ${ship.name} has arrived at ${ship.heading.to.name || ship.heading.to.id}`)
			ship = { ...ship }
			ship.location = {
				planet: ship.heading.to.id,
				position: 'orbit',
				state: 'inactive'
			}
			ship.heading = false

			if (ship.type === 'Atmosphere Processor')
			{
				const planet = snapshot.getLoadable(atoms.planets(ship.location.planet)).contents
				if (!planet.habitable)
				{
					// Start terraforming
					ship.location.state = 'active'
					ship.terraform = {
						//
					}

					console.log(`${ship.name} has started terraforming planet. Will complete by ...`)
				}
			}
		}
	}
	else
	{
		switch (ship.type)
		{
			case 'Atmosphere Processor':
			{
				break
			}
			case 'Solar-Satellite Generator':
			{
				if (ship.location.position === 'orbit')
				{
					//
				}
				break
			}
			case 'Core Mining Station':
			case 'Horticultural Station':
			{
				if (ship.location.position === 'surface' && ship.location.state === 'active')
				{
					//
				}
				break
			}
			default:
			{
				break
			}
		}
	}

	set(atoms.ships(ship.id), ship)
}

const updatePlanet = (id, snapshot, date, set) => {
}

const tick = (snapshot, set) => {
	// console.log("callback")
	const date = updateDate({ ...snapshot.getLoadable(atoms.date).contents }, set)

	const game = snapshot.getLoadable(atoms.game).contents

	game.ships.map(ship => updateShip(ship, snapshot, date, set))
	game.planets.map(planet => updatePlanet(planet, snapshot, date, set))

}


const Tick = props => {
	const date = useRecoilValue(atoms.date)
	const callback = useRecoilCallback(({ snapshot, set }) => () => tick(snapshot, set))

	useEffect(() => {
		// console.log("useEffect")
		setTimeout(callback, 1000)
	}, [date])

	return false
}

// Export the component which wraps the tick functionality
export default Tick