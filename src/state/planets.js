import { selector, selectorFamily, useRecoilCallback } from 'recoil'
import state from './atoms'
import { selectLocalPlayer } from './game'

export const selectCapitalPlanet = selectorFamily({
	key: 'capital',
	get: player => ({ get }) => {
		return get(state.planets(player.capitalPlanet))
	},
	set: player => ({ set }, newValue) => {
		return set(state.planets(player.capitalPlanet), newValue)
	}
})

export const selectPlayerCapitalPlanet = selectorFamily({
	key: 'playerCapital',
	get: player => ({ get }) => {
		const game = get(state.game)
		const realPlayer = game.players.find(p => p.id === player.id)
		return get(state.planets(realPlayer.capitalPlanet))
	}
})

export const selectPlanets = selector({
	key: 'allPlanets',
	get: ({ get }) => {
		const game = get(state.game)
		const planets = []

		game.planets.forEach(id => {
			const planet = get(state.planets(id))
			planets.push(planet)
		})

		// console.log(planets)
		return planets
	}
})

export const selectPopulatedPlanets = selector({
	key: 'populatedPlanets',
	get: ({ get }) => {
		const game = get(state.game)
		const populated = []

		game.planets.forEach(id => {
			const planet = get(state.planets(id))
			const owned = planet.owner ?? false
			// console.log(planet.id, planet.owner, owned)
			if (owned !== false)
			{
				populated.push(planet)
			}
		})

		// console.log("=>", populated)
		return populated
	},
	set: ({ get, set }, newValue) => {
		set(state.planets(newValue.id), newValue)
	}
})

const planetReducer = (planet, action) => {
	console.log("Planet reducer", planet, action)

	switch (action.type)
	{
		case 'tax':
		{
			if (action.value < 0 && planet.tax > 0)
			{
				planet = { ...planet }
				planet.tax = planet.tax + action.value
			}
			else if (action.value > 0 && planet.tax < 100)
			{
				planet = { ...planet }
				planet.tax = planet.tax + action.value
			}
			break
		}
		case 'rename':
		{
			if (action.name)
			{
				planet = { ...planet }
				planet.name = action.name
			}
			break
		}
		case 'transfer':
		{
			if (planet.resources.credits > 0)
			{
				planet = { ...planet }
				planet.resources = { ...planet.resources }
				action.capital.resources = { ...action.capital.resources }
				action.capital.resources.credits = action.capital.resources.credits + planet.resources.credits
				planet.resources.credits = 0
			}
			break
		}
		case 'change:aggression':
		{
			const role = action.player.id === planet.owner ? 'defender' : 'attacker'
			const aggression = planet[role + 'Aggression']

			if (aggression <= 25 && action.direction < 0)
			{
				console.warn(`Reached minimum aggression`)
			}
			else if (aggression >= 100 && action.direction > 0)
			{
				console.warn(`Reached maximum aggression`)
			}
			else
			{
				planet = { ...planet }
				planet[role + 'Aggression'] = aggression + (25 * action.direction)
			}
		}
		default:
		{
			console.warn(`Unhandled action ${action.type}`)
			break
		}
	}

	return planet
}

export const useChangeTax = () => {
	const callback = useRecoilCallback(({ snapshot, set }) => (planet, value) => {
		const refreshed = snapshot.getLoadable(state.planets(planet.id)).contents
		const reduced = planetReducer(refreshed, { type: 'tax', value })
		if (reduced !== refreshed)
		{
			set(state.planets(reduced.id), reduced)
		}
	})

	return callback
}

export const useRename = () => {
	const callback = useRecoilCallback(({ snapshot, set }) => (planet, name) => {
		const refreshed = snapshot.getLoadable(state.planets(planet.id)).contents
		const reduced = planetReducer(refreshed, { type: 'rename', name })
		if (reduced !== refreshed)
		{
			set(state.planets(reduced.id), reduced)
		}
	})

	return callback
}

export const useTransferCredits = player => {
	const callback = useRecoilCallback(({ snapshot, set }) => () => {
		const game = snapshot.getLoadable(state.game).contents
		player = game.players.find(p => p.id === player.id)
		const capital = { ...snapshot.getLoadable(state.planets(player.capitalPlanet)).contents }

		let tansferedCredits = false
		game.planets.forEach(id => {
			const planet = snapshot.getLoadable(state.planets(id)).contents

			if (capital !== planet && planet.owner === player.id)
			{
				const reduced = planetReducer(planet, { type: 'transfer', capital })
				if (reduced !== planet)
				{
					set(state.planets(reduced.id), reduced)
					tansferedCredits = true
				}
			}
		})

		if (tansferedCredits)
		{
			set(state.planets(capital.id), capital)
		}
	})

	return callback
}

export const useChangeAggression = planet => {
	const callback = useRecoilCallback(({ snapshot, set }) => direction => {
		const refreshed = snapshot.getLoadable(state.planets(planet.id)).contents
		const player = snapshot.getLoadable(selectLocalPlayer).contents
		const reduced = planetReducer(refreshed, { type: 'change:aggression', direction, player })
		if (reduced !== refreshed)
		{
			set(state.planets(reduced.id), reduced)
		}
	})

	return callback
}