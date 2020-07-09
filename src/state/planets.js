import { selector, selectorFamily } from 'recoil'
import atoms from './atoms'

export const selectCapitalPlanet = selectorFamily({
	key: 'capital',
	get: player => ({ get }) => {
		return get(atoms.planets(player.capitalPlanet))
	},
	set: player => ({ set }, newValue) => {
		return set(atoms.planets(player.capitalPlanet), newValue)
	}
})

export const selectPopulatedPlanets = selector({
	key: 'populatedPlanets',
	get: ({ get }) => {
		const game = get(atoms.game)
		const populated = []

		game.planets.forEach(id => {
			const planet = get(atoms.planets(id))
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
		set(atoms.planets(newValue.id), newValue)
	}
})