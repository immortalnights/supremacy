import { atom, useRecoilValue, useRecoilState, useRecoilCallback } from 'recoil'
import atoms from './atoms'
import { selectCapitalPlanet } from './planets'
import shipData from '../data/ships.json'
import cloneDeep from 'lodash/cloneDeep';

export const blueprints = atom({
	key: 'blueprints',
	default: shipData
})

export const useBuyShip = (player) => {
	const bps = useRecoilValue(blueprints)
	const [ game, setGame ] = useRecoilState(atoms.game)
	const [ capital, setCapital ] = useRecoilState(selectCapitalPlanet(player))
	const createShip = useRecoilCallback(({ set }) => ship => {
		set(atoms.ships(ship.id), ship)
	})

	return (key) => {
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

			// console.log(id, game.nextShipId)
			createShip({ id, owner: player.id, ...cloneDeep(bp) })
		}
		else
		{
			console.log("not enough credits on home planet")
		}
	}
}
