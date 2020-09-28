import { selector, selectorFamily, useRecoilCallback } from 'recoil'
import { selectHumanPlayer } from './game'
import atoms from './atoms'
import dates from '../logic/date'
import { canChangePosition } from '../logic/ships'
import { calculateTravel } from '../logic/travel'
import { calculateTransfer } from '../logic/general'
import { PLANET_POPULATION_LIMIT, PLANET_POSITION_LIMITS } from '../logic/planets'

export const selectPlayerShips = selector({
	key: 'playerShips',
	get: ({ get }) => {
		const human = get(selectHumanPlayer)
		const game = get(atoms.game)
		const ships = []

		game.ships.forEach(id => {
			const ship = get(atoms.ships(id))
			if (ship.owner === human.id)
			{
				ships.push(ship)
			}
		})

		return ships
	}
})

export const selectShipsAtPlanetPosition = selectorFamily({
	key: 'shipsAtPlanetPosition',
	get: key => ({ get }) => {
		const game = get(atoms.game)
		const ships = []

		game.ships.forEach(id => {
			const ship = get(atoms.ships(id))
			if (key && ship.location)
			{
				if (ship.location.planet === key.planet && ship.location.position === key.position)
				{
					ships.push(ship)
				}
			}
		})

		// console.log("shipsAtPlanetPosition", key, "=>", ships)
		return ships
	}
})

export const selectFirstInDock = selectorFamily({
	key: 'firstShipInDock',
	get: key => ({ get }) => {
		const game = get(atoms.game)
		const id = game.ships.find(id => {
			let match = false
			const ship = get(atoms.ships(id))

			if (ship.location && ship.location.planet === key && ship.location.position === 'docked')
			{
				match = true
			}

			return match
		})

		let result = null
		if (id !== undefined)
		{
			result = get(atoms.ships(id))
		}

		return result
	}
})

export const selectPlayerAtmos = selectorFamily({
	key: 'selectAtmos',
	get: player => ({ get }) => {
		let atmos
		const game = get(atoms.game)
		game.ships.find(id => {
			const ship = get(atoms.ships(id))
			if (ship.type === 'Atmosphere Processor' && ship.owner === player.id)
			{
				atmos = ship
			}
			return !!atmos
		})

		return atmos
	}
})

const beginTravel = (travel, ship, origin, destination, date) => {
	console.log("Init travel", origin, destination)

	ship = { ...ship }
	ship.fuel = ship.fuel - travel.fuel
	ship.heading = {
		from: { id: origin.id, name: origin.name },
		to: { id: destination.id, name: destination.name },
		departure: date,
		distance: travel.distance,
		arrival: dates.add(date, travel.duration),
		fuel: travel.fuel
	}
	// console.log("Heading", ship.heading)

	ship.location = {
		planet: null,
		position: 'space',
		state: 'inactive'
	}

	return ship
}

const findAtmos = (snapshot, player) => {
	const game = snapshot.getLoadable(atoms.game).contents
	let atmos

	game.ships.forEach(id => {
		const ship = snapshot.getLoadable(atoms.ships(id)).contents
		// console.log(id, ship)
		if (ship.owner === player.id && ship.type === 'Atmosphere Processor')
		{
			atmos = ship
		}
	})

	return atmos
}

// could be a hook?
const shipReducer = (ship, action) => {
	// console.log("Ship reducer", ship, action)
	const planet = action.planet

	switch (action.type)
	{
		case 'crew':
		{
			if (ship.requiredCrew === 0)
			{
				console.warn(`Ship ${ship.name} does not require a crew`)
			}
			else if (ship.crew === ship.requiredCrew)
			{
				console.warn(`Ship ${ship.name} already has a crew`)
			}
			else if (planet.population < ship.requiredCrew)
			{
				console.warn(`Planet ${planet.name} does not have enough population to crew ship ${ship.name}`)
			}
			else
			{
				ship = { ...ship }
				ship.crew = ship.requiredCrew
			}
			break
		}
		case 'reposition':
		{
			// Reposition a ship within a planet
			const nuclearFuelled = ship.capacity.fuel === null
			// repositionning cost 100 fuel, unless landing to transferring to the surface
			const fuelCost = ['docked', 'surface'].includes(action.position) ? 0 : 100

			const limit = PLANET_POSITION_LIMITS[action.position]

			// TODO validation
			if (ship.type === 'Atmosphere Processor')
			{
				console.warn(`Cannot directly control Atmos`)
			}
			else if (ship.location.position === action.position)
			{
				console.warn(`Ship is already in position ${action.position}`)
			}
			else if (ship.crew !== ship.requiredCrew)
			{
				console.warn(`Ship ${ship.name} does not have the required crew`)
			}
			else if (canChangePosition(ship.location.position, action.position) === false)
			{
				console.warn(`Ship ${ship.name} cannot move to ${action.position}`)
			}
			else if (!nuclearFuelled && ship.fuel < fuelCost)
			{
				console.warn(`Ship ${ship.name} does not have enough fuel, requires ${fuelCost} fuel`)
			}
			else if (limit != null && action.shipsAtLocation.length >= limit)
			{
				console.warn(`Position ${action.position} is full`)
			}
			else
			{
				ship = { ...ship }
				if (!nuclearFuelled && fuelCost)
				{
					ship.fuel = ship.fuel - fuelCost
				}
				ship.location = { ...ship.location }
				ship.location.position = action.position

				// remove surface state if moved off the surface
				if (ship.location.position !== 'surface')
				{
					delete ship.location.state
				}

				console.log(`Repositioned ${ship.name} to ${ship.location.position}`)
			}
			break
		}
		case 'activate':
		{
			// Activate ship on planet surface
			// TODO validation
			if (ship.crew !== ship.requiredCrew)
			{
				console.warn(`Ship does not have the required crew`)
			}
			else if (ship.location.position === 'surface')
			{
				ship = { ...ship }
				ship.location = { ...ship.location }
				ship.location.state = 'active'
			}
			break
		}
		case 'deactivate':
		{
			// Deactivate ship on planet surface
			// TODO validation
			if (ship.location.position === 'surface')
			{
				ship = { ...ship }
				ship.location = { ...ship.location }
				ship.location.state = 'inactive'
			}
			break
		}
		case 'travel':
		{
			// Sent ship to planet
			const origin = action.origin
			const destination = action.destination

			if (ship.type === 'Atmosphere Processor')
			{
				console.warn(`Cannot directly control Atmosphere Processor`)
			}
			else if (ship.heading)
			{
				console.warn(`${ship.name} is already travelling to planet ${ship.heading.to.id}`)
			}
			else if (ship.location.planet === destination.id)
			{
				console.warn(`${ship.name} is is already at ${destination.name}`)
			}
			else if (ship.location.position !== 'orbit')
			{
				console.warn(`${ship.name} is not in orbit of a planet (Location ${ship.location.position})`)
			}
			else
			{
				const travel = calculateTravel(origin, destination, ship)

				if (ship.capacity.fuel && ship.fuel < travel.fuel)
				{
					console.warn(`Ship ${ship.name} does not have enough fuel, requires ${travel.fuel} fuel`)
				}
				else
				{
					ship = beginTravel(travel, ship, origin, destination, action.date)
				}
			}
			break
		}
		case 'terraform':
		{
			const origin = action.origin
			const destination = action.destination

			if (ship.type !== 'Atmosphere Processor')
			{
				console.warn(`${ship.type} cannot terraform planets`)
			}
			else if (ship.location.planet === destination.id)
			{
				console.warn("Atmos is is already at", destination.name)
			}
			else if (ship.heading)
			{
				console.warn(`Atmos is already travelling to Planet ${ship.heading.to.id}`)
			}
			else if (ship.location.state === 'active')
			{
				const diff = dates.diff(action.date, ship.terraforming.completion)
				console.warn(`Atmosphere Processor is busy, will complete in ${diff} days`)
			}
			else if (destination.owner !== null)
			{
				console.warn(`Cannot terraform an occupied planet`)
			}
			else
			{
				const travel = calculateTravel(origin, destination, ship)

				// Atmos does not use fuel
				travel.fuel = 0

				ship = beginTravel(travel, ship, origin, destination, action.date)

				// Mark the planet are owned and terraformed
				destination.terraforming = true
				destination.owner = ship.owner
				destination.name = action.name
			}
			break
		}
		case 'transfer:cargo':
		{
			const check = (change, source, target, maximum) => {
				let ok = false
				// console.log("check", source, target, maximum)
				if (!maximum || (change > 0 && target >= maximum))
				{
					console.warn(`Ship does not have any available space for ${action.cargo}`)
				}
				else if (change > 0 && target >= maximum)
				{
					console.warn(`Ship has maximum capacity of ${action.cargo} on board`)
				}
				else if (change > 0 && source === 0)
				{
					console.warn(`Planet does not have any available ${action.cargo}`)
				}
				else
				{
					ok = true
				}

				return ok
			}

			console.assert(ship.cargo, `Ship does not have a cargo bay`)
			switch (action.cargo)
			{
				case 'civilians':
				{
					const source = planet.population
					const destination = ship.civilians
					const capacity = ship.capacity.civilians

					if (check(action.change, source, destination, capacity))
					{
						const transfer = calculateTransfer(source, destination, capacity, action.change)

						// console.log(`Transfer ${transfer}, ${source}, ${destination}, ${capacity}, ${action.change}`)
						ship = { ...ship }
						ship.civilians = ship.civilians + transfer
						planet.population = planet.population - transfer
					}
					break
				}
				case 'fuel':
				{
					const source = planet.resources.fuels
					const destination = ship.fuel
					const capacity = ship.capacity.fuel

					if (check(action.change, source, destination, capacity))
					{
						const transfer = calculateTransfer(source, destination, capacity, action.change)

						ship = { ...ship }
						ship.fuel = ship.fuel + transfer
						planet.resources = { ...planet.resources }
						planet.resources.fuels = planet.resources.fuels - transfer
					}
					break
				}
				case 'food':
				case 'minerals':
				case 'fuels':
				case 'energy':
				{
					const source = planet.resources[action.cargo]
					const destination = Object.keys(ship.cargo).reduce((mem, key) => (mem + ship.cargo[key]), 0)
					const capacity = ship.capacity.cargo

					if (check(action.change, source, destination, capacity))
					{
						const transfer = calculateTransfer(source, destination, capacity, action.change)

						ship = { ...ship }
						ship.cargo = { ...ship.cargo }
						ship.cargo[action.cargo] = ship.cargo[action.cargo] + transfer
						planet.resources = { ...planet.resources }
						planet.resources[action.cargo] = planet.resources[action.cargo] - transfer
					}
					break
				}
				default:
				{
					console.warn(`Invalid cargo ${action.cargo}`)
					break
				}
			}
			break
		}
		case 'unload:cargo':
		{
			let totalCargo = 0
			const cargoTypes = Object.keys(ship.cargo)
			cargoTypes.forEach(type => totalCargo = totalCargo + ship.cargo[type])

			if (!ship.location || ship.location.position !== 'docked')
			{
				console.warn(`Cannot unload ship ${ship.name} not in docking bay`)
			}
			else if (totalCargo === 0)
			{
				console.warn(`Ship ${ship.name} does not have any cargo to unload`)
			}
			else
			{
				ship = { ...ship }
				ship.cargo = { ...ship.cargo }
				// planet = { ...planet } Copy already provided

				planet.resources = { ...planet.resources }

				cargoTypes.forEach(type => {
					planet.resources[type] = planet.resources[type] + ship.cargo[type]
					ship.cargo[type] = 0
				})
			}
			break
		}
		case 'rename':
		{
			if (action.name)
			{
				ship = { ...ship }
				ship.name = action.name
			}
			break
		}
		case 'decommission':
		{
			if (!ship.location || ship.location.position !== 'docked')
			{
				console.warn(`Cannot decommission ship ${ship.name} as it is not docked`)
			}
			else
			{
				ship = { ...ship }
				ship.cargo = { ...ship.cargo }
				// planet = { ...planet } Copy already provided

				// Unload all cargo
				planet.resources = { ...planet.resources }

				const cargoTypes = Object.keys(ship.cargo)
				cargoTypes.forEach(type => {
					planet.resources[type] = planet.resources[type] + ship.cargo[type]
					ship.cargo[type] = 0
				})

				// Unload fuel
				planet.resources.fuels = planet.resources.fuels + ship.fuel
				ship.fuel = 0

				// Unload passengers
				planet.population = planet.population + ship.civilians
				ship.civilians = 0

				// Unload crew
				planet.population = planet.population + ship.crew
				ship.crew = 0

				// Refund credits (value), minerals and energy
				planet.credits = planet.credits + ship.value
				planet.resources.minerals = planet.resources.minerals
				planet.resources.energy = planet.resources.energy

				// Ensure population has not exceeded maximum
				planet.population = Math.min(planet.population, PLANET_POPULATION_LIMIT)

				// Mark the ship for removeal
				ship.decommissioned = true
			}
			break
		}
		default:
		{
			console.warn(`Unhandled action ${action.type}`)
			break
		}
	}

	return ship
}

export const useChangeShipPosition = () => {
	return useRecoilCallback(({ snapshot, set }) => (ship, position) => {
		// get the ship from the snapshot to ensure it's the latest version
		const refreshedShip = snapshot.getLoadable(atoms.ships(ship.id)).contents

		// Docks and Surface have limited space, so find all ships in the those target locations
		const shipsAtLocation = []

		if (['docked', 'surface'].includes(position))
		{
			const game = snapshot.getLoadable(atoms.game).contents
			game.ships.forEach(id => {
				const otherShip = snapshot.getLoadable(atoms.ships(id)).contents
				if (otherShip.location.planet === refreshedShip.location.planet && otherShip.location.position === position)
				{
					shipsAtLocation.push(otherShip)
				}
			})
		}

		const reducedShip = shipReducer(refreshedShip, { type: 'reposition', position, shipsAtLocation })
		if (reducedShip !== refreshedShip)
		{
			set(atoms.ships(reducedShip.id), reducedShip)
		}
	})
}

export const useSendShipToDestination = () => {
	return useRecoilCallback(({ snapshot, set }) => (ship, planet) => {
		const refreshedShip = snapshot.getLoadable(atoms.ships(ship.id)).contents
		const date = snapshot.getLoadable(atoms.date).contents
		const origin = snapshot.getLoadable(atoms.planets(refreshedShip.location.planet)).contents
		const destination = snapshot.getLoadable(atoms.planets(planet.id)).contents

		const reducedShip = shipReducer(refreshedShip, { type: 'travel', origin, destination, date })
		if (reducedShip !== refreshedShip)
		{
			set(atoms.ships(reducedShip.id), reducedShip)
		}
	})
}

export const useToggleShipOnSurface = () => {
	return useRecoilCallback(({ snapshot, set }) => (ship, state) => {
		// get the ship from the snapshot to ensure it's the latest version
		const refreshedShip = snapshot.getLoadable(atoms.ships(ship.id)).contents
		const reducedShip = shipReducer(refreshedShip, { type: state })
		if (reducedShip !== refreshedShip)
		{
			set(atoms.ships(reducedShip.id), reducedShip)
		}
	})
}

export const useAssignCrew = () => {
	return useRecoilCallback(({ snapshot, set }) => (ship, planet) => {
		const refreshedShip = snapshot.getLoadable(atoms.ships(ship.id)).contents
		const refreshedPlanet = snapshot.getLoadable(atoms.planets(planet.id)).contents
		const reducedShip = shipReducer(refreshedShip, { type: 'crew', planet: refreshedPlanet })
		if (reducedShip !== refreshedShip)
		{
			let updatedPlanet = { ...refreshedPlanet }
			updatedPlanet.population = updatedPlanet.population - ship.requiredCrew
			set(atoms.planets(updatedPlanet.id), updatedPlanet)
			set(atoms.ships(reducedShip.id), reducedShip)
		}
	})
}

export const useLoadUnloadCargo = (ship, planet) => {
	return useRecoilCallback(({ snapshot, set }) => (cargo, change) => {
		const refreshedShip = snapshot.getLoadable(atoms.ships(ship.id)).contents
		const refreshedPlanet = { ...snapshot.getLoadable(atoms.planets(planet.id)).contents }
		// note, shipReducer will modify the planet because in this function excatly
		// how much of the cargo has been loaded is not known (may be less than `change`).
		const reducedShip = shipReducer(refreshedShip, { type: 'transfer:cargo', planet: refreshedPlanet, cargo, change })
		if (reducedShip !== refreshedShip)
		{
			set(atoms.planets(refreshedPlanet.id), refreshedPlanet)
			set(atoms.ships(reducedShip.id), reducedShip)
		}
	})
}

export const useUnloadAllCargo = (ship, planet) => {
	return useRecoilCallback(({ snapshot, set }) => () => {
		const refreshedShip = snapshot.getLoadable(atoms.ships(ship.id)).contents
		const refreshedPlanet = { ...snapshot.getLoadable(atoms.planets(planet.id)).contents }
		// note, shipReducer will modify the planet
		const reducedShip = shipReducer(refreshedShip, { type: 'unload:cargo', planet: refreshedPlanet })
		if (reducedShip !== refreshedShip)
		{
			set(atoms.planets(refreshedPlanet.id), refreshedPlanet)
			set(atoms.ships(reducedShip.id), reducedShip)
		}
	})
}

export const useDecommissionShip = (ship, planet) => {
	return useRecoilCallback(({ snapshot, set }) => (cargo, change) => {
		const refreshedShip = snapshot.getLoadable(atoms.ships(ship.id)).contents
		const refreshedPlanet = { ...snapshot.getLoadable(atoms.planets(planet.id)).contents }
		// note, shipReducer will modify the planet
		const reducedShip = shipReducer(refreshedShip, { type: 'decommission', planet: refreshedPlanet })
		if (reducedShip !== refreshedShip)
		{
			set(atoms.planets(refreshedPlanet.id), refreshedPlanet)

			const game = { ...snapshot.getLoadable(atoms.game).contents }
			const index = game.ships.findIndex(id => id === ship.id)
			game.ships = [ ...game.ships ]
			game.ships.splice(index, 1)
			set(atoms.game, game)

			set(atoms.ships(reducedShip.id), null)
		}
	})
}

export const useSendAtmos = player => {
	return useRecoilCallback(({ snapshot, set }) => (planet, name) => {
		console.assert(planet && planet.id, "Invalid destination planet")

		const atmos = findAtmos(snapshot, player)

		if (atmos)
		{
			const date = snapshot.getLoadable(atoms.date).contents
			const origin = snapshot.getLoadable(atoms.planets(atmos.location.planet)).contents
			const destination = { ...snapshot.getLoadable(atoms.planets(planet.id)).contents }

			const reducedShip = shipReducer(atmos, { type: 'terraform', origin, destination, date, name })
			if (reducedShip !== atmos)
			{
				set(atoms.planets(destination.id), destination)
				set(atoms.ships(reducedShip.id), reducedShip)
			}
		}
		else
		{
			console.warn("Player does not own a Atmosphere Processor")
		}
	})
}

export const useRename = () => {
	const callback = useRecoilCallback(({ snapshot, set }) => (ship, name) => {
		const refreshed = snapshot.getLoadable(atoms.ships(ship.id)).contents
		const reduced = shipReducer(refreshed, { type: 'rename', name })
		if (reduced !== refreshed)
		{
			set(atoms.ships(reduced.id), reduced)
		}
	})

	return callback
}