import { selector, selectorFamily } from 'recoil'
import atoms from './atoms'

export const selectHumanPlayer = selector({
	key: 'humanPlayer',
	get: ({ get }) => {
		const game = get(atoms.game)
		return game.players.find(p => p.type === 'human')
	}
})

export const selectPlayer = selectorFamily({
	key: 'player',
	get: id => ({ get }) => {
		const game = get(atoms.game)
		return game.players.find(p => p.id === id)
	}
})