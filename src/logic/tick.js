import React, { useEffect } from 'react'
import { useRecoilValue, useRecoilCallback } from 'recoil'
import date from './date'
import { terraformPlanet } from './planets'
import store from '../state/atoms'
import { selectPlayer } from '../state/game'

const updateDate = (currentDate, set) => {
	const next = date.next(currentDate)
	set(store.date, next)
	return next
}

const updateShip = (id, snapshot, currentDate, set) => {
	let ship = snapshot.getLoadable(store.ships(id)).contents

	if (ship.heading)
	{
		if (date.equal(ship.heading.arrival, currentDate))
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
				const planet = snapshot.getLoadable(store.planets(ship.location.planet)).contents
				if (!planet.habitable)
				{
					const duration = planet.terraformDuration
					const completion = date.add(date.fromDays(duration), currentDate)
					// Start terraforming
					ship.location.position = 'surface'
					ship.location.state = 'active'
					ship.terraforming = {
						duration,
						completion
					}

					console.log(`${ship.name} has started terraforming planet. Will complete by ${date.format(completion)}`)
				}
			}
		}
	}
	else //ship.location.state === 'active'
	{
		switch (ship.type)
		{
			case 'Atmosphere Processor':
			{
				if (ship.location.state === 'active' && ship.terraforming)
				{
					if (date.equal(ship.terraforming.completion, currentDate))
					{
						console.log(`Terraforming of planet ${ship.location.planet} completed.`)

						const player = snapshot.getLoadable(selectPlayer(ship.owner)).contents
						const planet = { ...snapshot.getLoadable(store.planets(ship.location.planet)).contents }

						terraformPlanet(player, planet, 'Planet X')
						console.log("Terraformed planet", planet)

						set(store.planets(ship.location.planet), planet)

						ship = { ...ship }
						ship.location = {
							planet: planet.id,
							position: 'surface',
							state: 'inactive'
						}
						ship.terraforming = false
					}
				}
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

	set(store.ships(ship.id), ship)
}

const updatePlanet = (id, snapshot, currentDate, set) => {
}

const tick = (snapshot, set) => {
	// console.log("callback")
	const nextDate = updateDate({ ...snapshot.getLoadable(store.date).contents }, set)

	const game = snapshot.getLoadable(store.game).contents

	game.ships.map(ship => updateShip(ship, snapshot, nextDate, set))
	game.planets.map(planet => updatePlanet(planet, snapshot, nextDate, set))
}


const Tick = props => {
	const currentDate = useRecoilValue(store.date)
	const callback = useRecoilCallback(({ snapshot, set }) => () => tick(snapshot, set))

	useEffect(() => {
		// console.log("useEffect")
		setTimeout(callback, 1000)
	}, [currentDate, callback])

	return false
}

// Export the component which wraps the tick functionality
export default Tick