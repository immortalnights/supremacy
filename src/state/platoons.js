import { selectorFamily, useRecoilCallback } from 'recoil'
import state from './atoms'
import { selectSuit, selectWeapon } from '../state/equipment'
import { selectPlayerCapitalPlanet } from '../state/planets'
import { MAXIMUM_PLATOON_SIZE } from '../logic/platoons'
import { calculateTransfer } from '../logic/general'
import { calculatePlatoonCost } from '../logic/platoons'

export const selectPlatoon = selectorFamily({
	key: 'selectPlatoon',
	get: key => ({ get }) => {
		return get(state.platoons(key))
	}
})

export const selectPlatoons = selectorFamily({
	key: 'selectPlatoons',
	get: key => ({ get }) => {
		const game = get(state.game)
		const platoons = []

		game.platoons.forEach(id => {
			const p = get(state.platoons(id))

			// console.log(p.name, p.location)
			// console.log("(key.name == null || key.name === p.name)", (key.name == null || key.name === p.name))
			// console.log("(key.player == null || key.player === p.owner)", (key.player == null || key.player === p.owner))
			// console.log("(key.planet == null || key.planet === p.location.planet)", (key.planet == null || (p.location && key.planet === p.location.planet)))
			// console.log("(key.ship == null || key.ship === p.location.ship)", (key.ship == null || (p.location && key.ship === p.location.ship)))

			if ((key.commissioned ===undefined || key.commissioned === p.commissioned) &&
				(key.name === undefined || key.name === p.name) &&
				(key.player === undefined || key.player === p.owner) &&
				(key.planet === undefined || (p.location && key.planet === p.location.planet)) &&
				(key.ship === undefined || (p.location && key.ship === p.location.ship)))
			{
				platoons.push(p)
			}
		})

		return platoons
	}
})

export const selectPlayerPlatoonIndexes = selectorFamily({
	key: 'selectPlayerPlatoonIndexes',
	get: key => ({ get }) => {
		const game = get(state.game)

		const platoons = game.platoons.filter(id => {
			const p = get(state.platoons(id))
			return p.owner === key.id
		})

		return platoons
	}
})

export const selectPlayerPlatoon = selectorFamily({
	key: 'playerPlatoon',
	get: key => ({ get }) => {
		const game = get(state.game)
		let platoon

		game.platoons.find(id => {
			const p = get(state.platoons(id))
			if (p.owner === key.player && p.name === key.name)
			{
				platoon = p
			}

			return !!platoon
		})

		return platoon
	}
})

const platoonReducer = (platoon, action) => {
	switch (action.type)
	{
		case 'change:equipment':
		{
			if (platoon.commissioned)
			{
				console.warn("Cannot change equipment for commissioned platoon")
			}
			else
			{
				platoon = { ...platoon }
				platoon.suit = action.suit
				platoon.weapon = action.weapon
			}
			break
		}
		case 'change:troops':
		{
			const planet = action.planet

			if (platoon.commissioned)
			{
				console.warn("Cannot change equipment for commissioned platoon")
			}
			else if (action.change < 0 && platoon.troops === 0)
			{
				console.warn("Platoon has no troops")
			}
			else if (action.change > 0 && platoon.troops === MAXIMUM_PLATOON_SIZE)
			{
				console.warn("Platoon has reached maximum size")
			}
			else if (action.change > 0 && planet.population === 0)
			{
				console.warn("Planet does not have any available civilians")
			}
			else
			{
				const transfer = calculateTransfer(planet.population, platoon.troops, MAXIMUM_PLATOON_SIZE, action.change)

				platoon = { ...platoon }
				platoon.troops = platoon.troops + transfer
				planet.population = planet.population - transfer

				if (transfer > 0)
				{
					platoon.additionalTroops = platoon.additionalTroops + transfer
				}
			}
			break
		}
		case 'commission':
		{
			if (platoon.commissioned)
			{
				console.warn("Cannot commission an active platoon")
			}
			else if (platoon.troops === 0)
			{
				console.warn("Cannot commission an empty platoon")
			}
			else
			{
				const planet = action.planet

				// AI does not pay for commissioning a platoon
				const cost = action.free ? 0 : calculatePlatoonCost(platoon, action.suit, action.weapon)

				if (cost > planet.resources.credits)
				{
					console.warn("Cannot commission platoon, plant does not have enough credits")
				}
				else
				{
					planet.resources = { ...planet.resources }
					planet.resources.credits = planet.resources.credits - cost

					platoon = { ...platoon }
					platoon.commissioned = true
					platoon.unitStrength = action.suit.armour + action.weapon.damage
					platoon.location = {
						planet: planet.id,
						name: planet.name
					}
				}
			}
			break
		}
		case 'disband':
		{
			if (!platoon.commissioned)
			{
				console.warn(`Cannot disband invalid platoon`)
			}
			else if (platoon.location.planet !== action.capital.id)
			{
				console.warn(`Cannot disband platoon which is not located at the player's capital`)
			}
			else
			{
				// Troops are not removed from the platoon, but the platoon can be edited
				platoon = { ...platoon }
				platoon.commissioned = false
			}
			break
		}
		case 'transfer':
		{
			if (!platoon.commissioned || platoon.troops === 0)
			{
				console.warn(`Platoon ${platoon.name} is invalid ${platoon.commissioned} ${platoon.troops}`)
			}
			else if (action.ship.capacity.platoons === 0)
			{
				console.warn(`Ship '${action.ship.name}' has no platoon capacity`)
			}
			else if (action.direction === 'load')
			{
				if (platoon.location.planet == null)
				{
					console.warn(`Platoon ${platoon.name} is not on a planet`)
				}
				else if (platoon.location.planet !== action.planet.id)
				{
					console.warn(`Platoon ${platoon.name} is not on planet ${action.planet.id}`)
				}
				else if (action.platoonsInShip.length >= action.ship.capacity.platoons)
				{
					console.warn(`Ship '${action.ship.name}' is full`)
				}
				else
				{
					platoon = { ...platoon }
					platoon.location = { ...platoon.location }

					delete platoon.location.planet
					platoon.location.ship = action.ship.id
					platoon.location.name = action.ship.name
				}
			}
			else if (action.direction === 'unload')
			{
				if (platoon.location.ship == null)
				{
					console.warn(`Platoon ${platoon.name} is not on a planet`)
				}
				else if (platoon.location.ship !== action.ship.id)
				{
					console.warn(`Platoon ${platoon.name} is not in ship ${action.ship.name}`)
				}
				else if (action.platoonsOnPlanet.length >= 24)
				{
					console.log(`Planet ${action.planet.id} is full`)
				}
				else
				{
					platoon = { ...platoon }
					platoon.location = { ...platoon.location }

					delete platoon.location.ship
					platoon.location.planet = action.planet.id
					platoon.location.name = action.planet.name
				}
			}
			else
			{
				console.warn("Invalid direction", action.direction)
			}
			break;
		}
		default:
		{
			console.warn(`Unhandled action ${action.type}`)
			break
		}
	}

	return platoon
}

export const useChangeEquipment = platoon => {
	return useRecoilCallback(({ snapshot, set }) => (suit, weapon) => {
		const refreshedPlatoon = snapshot.getLoadable(state.platoons(platoon.id)).contents
		const reducedPlatoon = platoonReducer(refreshedPlatoon, { type: 'change:equipment', suit, weapon })
		if (reducedPlatoon !== refreshedPlatoon)
		{
			set(state.platoons(reducedPlatoon.id), reducedPlatoon)
		}
	})
}

export const useChangeTroops = (platoon, planet) => {
	return useRecoilCallback(({ snapshot, set }) => change => {
		const refreshedPlatoon = snapshot.getLoadable(state.platoons(platoon.id)).contents
		const refreshedPlanet = { ...snapshot.getLoadable(state.planets(planet.id)).contents }
		const reducedPlatoon = platoonReducer(refreshedPlatoon, { type: 'change:troops', planet: refreshedPlanet, change })
		if (reducedPlatoon !== refreshedPlatoon)
		{
			set(state.planets(refreshedPlanet.id), refreshedPlanet)
			set(state.platoons(reducedPlatoon.id), reducedPlatoon)
		}
	})
}

export const useCommissionPlatoon = (player, planet) => {
	return useRecoilCallback(({ snapshot, set }) => platoon => {
		const refreshedPlatoon = snapshot.getLoadable(state.platoons(platoon.id)).contents
		const refreshedPlanet = { ...snapshot.getLoadable(state.planets(planet.id)).contents }
		const suit = snapshot.getLoadable(selectSuit(platoon.suit)).contents
		const weapon = snapshot.getLoadable(selectWeapon(platoon.weapon)).contents
		const free = (player.type === 'ai')

		const reducedPlatoon = platoonReducer(refreshedPlatoon, { type: 'commission', planet: refreshedPlanet, suit, weapon, free })
		if (reducedPlatoon !== refreshedPlatoon)
		{
			set(state.planets(refreshedPlanet.id), refreshedPlanet)
			set(state.platoons(reducedPlatoon.id), reducedPlatoon)
		}
	})
}

export const useDisbandPlatoon = platoon => {
	return useRecoilCallback(({ snapshot, set }) => () => {
		const refreshedPlatoon = snapshot.getLoadable(state.platoons(platoon.id)).contents
		const capitalPlanet = snapshot.getLoadable(selectPlayerCapitalPlanet({ id: platoon.owner })).contents
		const platoonPlanet = snapshot.getLoadable(state.planets(platoon.planet)).contents
		const reducedPlatoon = platoonReducer(refreshedPlatoon, { type: 'disband', planet: platoonPlanet, capital: capitalPlanet })
		if (reducedPlatoon !== refreshedPlatoon)
		{
			set(state.platoons(reducedPlatoon.id), reducedPlatoon)
		}
	})
}

export const useTransferPlatoon = () => {
	return useRecoilCallback(({ snapshot, set }) => (direction, platoon, planet, ship) => {
		const platoonsOnPlanet = snapshot.getLoadable(selectPlatoons({ planet: planet.id })).contents
		const platoonsInShip = snapshot.getLoadable(selectPlatoons({ ship: ship.id })).contents
		const refreshedPlatoon = snapshot.getLoadable(state.platoons(platoon.id)).contents
		const reducedPlatoon = platoonReducer(refreshedPlatoon, { type: 'transfer', direction, planet, ship, platoonsOnPlanet, platoonsInShip })
		if (reducedPlatoon !== refreshedPlatoon)
		{
			set(state.platoons(reducedPlatoon.id), reducedPlatoon)
		}
	})
}