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
		}
		case 'reposition':
		{
			// Reposition a ship within a planet
			// TODO validation
			if (ship.location.position === action.position)
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
			if (ship.location.position !== 'orbit')
			{
				console.log(`Ship is not in orbit of a planet (${ship.location.position})`)
			}
			else if (ship.location.planet === action.destination.id)
			{
				console.log("Ship is is already at", action.destination.name)
			}
			else
			{
				const origin = action.origin
				const destination = action.destination

				const travel = calculateTravel(origin, destination, ship)

				ship = { ...ship }
				ship.heading = {
					from: { id: origin.id, name: origin.name },
					to: { id: destination.id, name: destination.name },
					departure: action.date,
					distance: travel.distance,
					arrival: addDates(action.date, travel.duration),
					fuel: travel.fuel
				}
				// console.log("Heading", ship.heading)

				ship.location = {
					planet: null,
					position: 'space'
				}
			}
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
