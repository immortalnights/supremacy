import { selector, selectorFamily, useRecoilCallback } from 'recoil'
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

export const useChangeShipPosition = () => {
	const callback = useRecoilCallback(({ snapshot, set }) => (ship, position) => {
		let refreshShip = snapshot.getLoadable(atoms.ships(ship.id)).contents
		if (refreshShip.location.position !== position)
		{
			refreshShip = { ...refreshShip }
			refreshShip.location = { ...refreshShip.location }
			refreshShip.location.position = position
			set(atoms.ships(refreshShip.id), refreshShip)
		}
	})

	return callback
}
