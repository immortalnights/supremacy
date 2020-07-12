import { selector, selectorFamily } from 'recoil'
import { selectHumanPlayer } from './game'
import atoms from './atoms'

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

export const selectDockedShips = selectorFamily({
	key: 'dockedShips',
	get: planet => ({ get }) => {
		return []
	}
})