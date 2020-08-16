import { selector, selectorFamily } from 'recoil'
import atoms from './atoms'

export const selectLocalPlayer = selector({
	key: 'humanPlayer',
	get: ({ get }) => {
		const game = get(atoms.game)
		return game.players.find(p => p.type === 'human')
	}
})

export const selectHumanPlayer = selectLocalPlayer

export const selectPlayer = selectorFamily({
	key: 'player',
	get: id => ({ get }) => {
		const game = get(atoms.game)
		return game.players.find(p => p.id === id)
	}
})