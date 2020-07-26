import { selector, selectorFamily, useRecoilCallback } from 'recoil'
import { selectHumanPlayer } from './game'
import atoms from './atoms'
import { addDates } from '../logic/date'
import { canChangePosition } from '../logic/ships'
import { calculateTravel } from '../logic/travel'

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
			if (ship.location)
			{
				if (ship.location.planet === key.planet && ship.location.position === key.position)
				{
					ships.push(ship)
				}
			}
		})

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

const beginTravel = (ship, origin, destination, date) => {
	console.log("Init travel", origin, destination)
	const travel = calculateTravel(origin, destination, ship)

	ship = { ...ship }
	ship.heading = {
		from: { id: origin.id, name: origin.name },
		to: { id: destination.id, name: destination.name },
		departure: date,
		distance: travel.distance,
		arrival: addDates(date, travel.duration),
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
		console.log(id, ship)
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
	switch (action.type)
	{
		case 'crew':
		{
			const planet = action.planet
			if (ship.requiredCrew === 0)
			{
				console.log(`Ship ${ship.name} does not require a crew`)
			}
			else if (ship.crew === ship.requiredCrew)
			{
				console.log(`Ship ${ship.name} already has a crew`)
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
				console.log(`Ship ${ship.name} does not have the required crew`)
			}
			else if (canChangePosition(ship.location.position, action.position) === false)
			{
				console.warn(`Ship ${ship.name} cannot move to ${action.position}`)
			}
			else if (!['docked', 'surface'].includes(action.position) && ship.maximumFuel < 0 && ship.fuel < 100)
			{
				console.warn(`Ship ${ship.name} does not have enough fuel`)
			}
			else
			{
				ship = { ...ship }
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
				console.log(`Ship does not have the required crew`)
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
			// TODO validation
			if (ship.type === 'Atmosphere Processor')
			{
				console.warn(`Cannot directly control Atmon`)
			}
			else if (ship.heading)
			{
				console.warn(`Ship is already travelling to Planet ${ship.heading.to.id}`)
			}
			else if (ship.location.planet === action.destination.id)
			{
				console.log("Ship is is already at", action.destination.name)
			}
			else if (ship.location.position !== 'orbit')
			{
				console.log(`Ship is not in orbit of a planet (${ship.location.position})`)
			}
			else
			{
				const origin = action.origin
				const destination = action.destination

				ship = beginTravel(ship, origin, destination, action.date)
			}
			break
		}
		case 'terraform':
		{
			if (ship.type !== 'Atmosphere Processor')
			{
				console.warn(`${ship.type} cannot terraform planets`)
			}
			else if (ship.heading)
			{
				console.warn(`Ship is already travelling to Planet ${ship.heading.to.id}`)
			}
			else if (ship.location.state === 'active')
			{
				console.warn(`Atmosphere Processor is busy`)
			}
			else if (action.destination.owner)
			{
				console.warn(`Cannot terraform an occupied planet`)
			}
			else
			{
				const origin = action.origin
				const destination = action.destination

				ship = beginTravel(ship, origin, destination, action.date)
			}
			break
		}
		case 'load:cargo':
		{
			const planet = action.planet

			const check = (source, target, maximum) => {
				let ok = false
				// console.log("check", source, target, maximum)
				if (!maximum)
				{
					console.warn(`Ship does not have any available space for ${action.cargo}`)
				}
				else if (target === maximum)
				{
					console.warn(`Ship has maximum capacity of ${action.cargo} on board`)
				}
				else if (source === 0)
				{
					console.warn(`Planet does not have any available ${action.cargo}`)
				}
				else
				{
					ok = true
				}

				return ok
			}

			const calculateTransfer = (source, target, maximum, requested) => {
				let transfer
				if (requested > 0)
				{
					transfer = Math.min(maximum - target, source, requested)
				}
				else
				{
					transfer = -Math.min(target, Math.abs(requested))
				}

				return transfer
			}

			console.assert(ship.cargo, `Ship does not have a cargo bay`)
			switch (action.cargo)
			{
				case 'civilians':
				{
					const source = planet.population
					const destination = ship.cargo.civilians
					const capacity = ship.capacity.civilians

					if (check(source, destination, capacity))
					{
						const transfer = calculateTransfer(source, destination, capacity, action.change)

						// console.log(`Transfer ${transfer}, ${source}, ${destination}, ${capacity}, ${action.change}`)
						ship = { ...ship }
						ship.cargo = { ...ship.cargo }
						ship.cargo.civilians = ship.cargo.civilians + transfer
						planet.population = planet.population - transfer
					}
					break
				}
				case 'fuel':
				{
					const source = planet.resources.fuels
					const destination = ship.fuel
					const capacity = ship.maximumFuel

					if (check(source, destination, capacity))
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
					const destination = ship.cargo[action.cargo]
					const capacity = ship.capacity[action.cargo]

					if (check(source, destination, capacity))
					{
						const transfer = calculateTransfer(source, destination, capacity, action.change)

						ship = { ...ship }
						ship.fuel = ship.fuel + transfer
						planet.resources = { ...planet.resources }
						planet.resources.fuels = planet.resources.fuels - transfer
					}
					break
				}
				default:
				{
					console.warn(`Invalid cargo ${action.cargo}`)
					break;
				}
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
		const reducedShip = shipReducer(refreshedShip, { type: 'reposition', position })
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
		const reducedShip = shipReducer(refreshedShip, { type: 'load:cargo', planet: refreshedPlanet, cargo, change })
		if (reducedShip !== refreshedShip)
		{
			set(atoms.planets(refreshedPlanet.id), refreshedPlanet)
			set(atoms.ships(reducedShip.id), reducedShip)
		}
	})
}

export const useSendAtmos = () => {
	return useRecoilCallback(({ snapshot, set }) => planet => {
		console.assert(planet && planet.id, "Invalid destination planet")

		const player = snapshot.getLoadable(selectHumanPlayer).contents
		const atmos = findAtmos(snapshot, player)

		if (atmos)
		{
			const date = snapshot.getLoadable(atoms.date).contents
			const origin = snapshot.getLoadable(atoms.planets(atmos.location.planet)).contents
			const destination = snapshot.getLoadable(atoms.planets(planet.id)).contents

			const reducedShip = shipReducer(atmos, { type: 'terraform', origin, destination, date })
			if (reducedShip !== atmos)
			{
				set(atoms.ships(reducedShip.id), reducedShip)
			}
		}
		else
		{
			console.warn("Player does not own a Atmosphere Processor")
		}
	})
}