import { atom, selectorFamily, useRecoilCallback } from 'recoil'
import atoms from './atoms'
import { selectHumanPlayer } from './game'
import { selectCapitalPlanet } from './planets'
import { createShip } from '../logic/ships'
import { PLANET_POSITION_LIMITS } from '../logic/planets'
import { selectShipsAtPlanetPosition } from '../state/ships'
import shipData from '../data/ships.json'

export const blueprints = atom({
	key: 'blueprints',
	default: shipData
})

export const selectCountOwnedShip = selectorFamily({
	key: 'countOwnedShip',
	get: ship => ({ get }) => {
		const player = get(selectHumanPlayer)
		const game = get(atoms.game)

		let count = 0
		game.ships.forEach(id => {
			const gameShip = get(atoms.ships(id))
			if (gameShip.owner === player.id && gameShip.type === ship.type)
			{
				count ++
			}
		})

		return count
	}
})

export const selectNextShipName = selectorFamily({
	key: 'nextShipName',
	get: ship => ({ get }) => {
		const count = get(selectCountOwnedShip(ship))
		return ship.shortName.substring(0, 10) + " " + (count + 1)
	}
})

const canAfford = (cost, resources) => {
	// Expand to cover all potential resource costs
	console.log("Can afford", cost, resources)
	return resources.credits >= cost.credits
}

const takeCost = (resources, cost) => {
	// Expand to cover all potential resource costs
	resources.credits = resources.credits - cost.credits
	return resources
}

const hasAtmos = (snapshot, player) => {
	const game = snapshot.getLoadable(atoms.game).contents
	let owned = false

	game.ships.forEach(id => {
		const ship = snapshot.getLoadable(atoms.ships(id)).contents
		console.log(id, ship)
		if (ship.owner === player.id && ship.type === 'Atmosphere Processor')
		{
			owned = true
		}
	})

	return owned
}

export const useBuyShip = player => {
	return useRecoilCallback(({ snapshot, set }) => (key, name) => {
		const bps = snapshot.getLoadable(blueprints).contents
		const date = snapshot.getLoadable(atoms.date).contents
		const game = snapshot.getLoadable(atoms.game).contents
		const capital = snapshot.getLoadable(selectCapitalPlanet(player)).contents
		const shipsInBay = snapshot.getLoadable(selectShipsAtPlanetPosition({ planet: capital.id, position: 'docked' })).contents
		const blueprint = bps[key]

		console.log(key, blueprint, bps)
		if (canAfford(blueprint.cost[0], capital.resources) === false)
		{
			console.warn("Not enough credits on home planet")
		}
		else if (shipsInBay.length >= PLANET_POSITION_LIMITS['docked'])
		{
			console.warn("Cannot buy ship, docking bay is full")
		}
		else if (key === 'atmos' && hasAtmos(snapshot, player))
		{
			console.log("Player already owns an Atmos")
		}
		else
		{
			const resources = takeCost({ ...capital.resources }, blueprint.cost[0])
			set(atoms.planets(capital.id), { ...capital, resources: resources })

			// console.log(game.nextShipId)
			const id = game.nextShipId
			const ship = createShip(blueprint, id, name, player, capital, date)

			console.log("New ship", ship.id, ship)
			set(atoms.ships(ship.id), ship)
			if (key === 'atmos')
			{
				// const index = game.players.findIndex(p => p.id === player.id)
				// game.players = [ ...game.players ]
				// game.players[index] = { ...game.players[index] }
				// game.players[index].atmos = ship.id
			}

			set(atoms.game, {
				...game,
				nextShipId: game.nextShipId + 1,
				ships: [ ...game.ships, id ]
			})
		}
	}, [])
}
