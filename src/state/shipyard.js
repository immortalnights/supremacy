import { atom, selectorFamily, useRecoilValue, useRecoilState, useRecoilCallback } from 'recoil'
import atoms from './atoms'
import { selectHumanPlayer } from './game'
import { selectCapitalPlanet } from './planets'
import shipData from '../data/ships.json'
import cloneDeep from 'lodash/cloneDeep';

export const blueprints = atom({
	key: 'blueprints',
	default: shipData
})

export const selectNextShipName = selectorFamily({
	key: 'nextShipName',
	get: ship => ({ get }) => {
		const player = get(selectHumanPlayer)
		const game = get(atoms.game)

		let count = 1
		let shortName = ship.shortName
		game.ships.forEach(id => {
			const gameShip = get(atoms.ships(id))
			if (gameShip.owner === player.id && gameShip.type === ship.type)
			{
				count ++
			}
		})

		return shortName.substring(0, 10) + " " + count
	}
})

export const useBuyShip = (player) => {
	const bps = useRecoilValue(blueprints)
	const [ game, setGame ] = useRecoilState(atoms.game)
	const [ capital, setCapital ] = useRecoilState(selectCapitalPlanet(player))
	const createShip = useRecoilCallback(({ set }) => ship => {
		// Should all the sets be done in the callback?
		set(atoms.ships(ship.id), ship)
	})

	return (key, name) => {
		const bp = bps[key]
		// console.log(capital, bp)

		if (capital.resources.credits > bp.cost)
		{
			const resources = { ...capital.resources }
			resources.credits = resources.credits - bp.cost

			setCapital({ ...capital, resources: resources })

			const player = game.players.find(p => p.type === 'human')

			// console.log(game.nextShipId)
			const id = game.nextShipId
			setGame({
				...game,
				nextShipId: game.nextShipId + 1,
				ships: [ ...game.ships, id ]
			})

			// set the location of the new ship
			// Plant only has three docking bays
			const location = {
				planet: capital.id,
				position: 'docked'
			}

			// console.log(id, game.nextShipId)
			createShip({
				id,
				owner: player.id,
				name: name,
				location,
				crew: 0,
				cargo: {
					"civilians": 0,
					"cargo": 0,
					"fuel": 0,
					"platoons": []
				},
				...cloneDeep(bp)
			})
		}
		else
		{
			console.log("not enough credits on home planet")
		}
	}
}
