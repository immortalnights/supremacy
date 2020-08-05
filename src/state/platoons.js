import { atom, selector, selectorFamily, useRecoilCallback } from 'recoil'
import state from './atoms'
import { MAXIMUM_PLATOON_SIZE } from '../logic/platoons'
import { calculateTransfer } from '../logic/general'

export const selectPlatoon = selectorFamily({
	key: 'selectPlatoon',
	get: key => ({ get }) => {
		return get(state.platoons(key))
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
		console.log('selectPlayerPlatoons', key)

		game.platoons.find(id => {
			const p = get(state.platoons(id))
			if (p.owner === key.player && p.name === key.name)
			{
				platoon = p
			}

			return !!platoon
		})

		console.log("playerPlatoon", key, "=>", platoon)
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
				console.warn("Cannot comission an active platoon")
			}
			else if (platoon.troops === 0)
			{
				console.warn("Cannot commission an empty platoon")
			}
			else
			{
				platoon = { ...platoon }
				platoon.commissioned = true
				platoon.location = {
					planet: action.planet.id
				}
			}
			break
		}
		default:
		{
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

export const useCommissionPlatoon  = (platoon, planet) => {
	return useRecoilCallback(({ snapshot, set }) => () => {
		const refreshedPlatoon = snapshot.getLoadable(state.platoons(platoon.id)).contents
		const reducedPlatoon = platoonReducer(refreshedPlatoon, { type: 'commission', planet })
		if (reducedPlatoon !== refreshedPlatoon)
		{
			set(state.platoons(reducedPlatoon.id), reducedPlatoon)
		}
	})
}