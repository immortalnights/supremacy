import { selectorFamily } from 'recoil'
import atoms from './atoms'


export const capitalSelector = selectorFamily({
	key: 'capitalSelector',
	get: player => ({ get }) => {
		return get(atoms.planets(player.capitalPlanet))
	},
	set: player => ({ set }, newValue) => {
		return set(atoms.planets(player.capitalPlanet), newValue)
	}
})