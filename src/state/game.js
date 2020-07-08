import { selector } from 'recoil'
import atoms from './atoms'

export const humanPlayerSelector = selector({
	key: 'humanPlayerSelectorcapitalSelector',
	get: ({ get }) => {
		const game = get(atoms.game)
		return game.players.find(p => p.type === 'human')
	}
})