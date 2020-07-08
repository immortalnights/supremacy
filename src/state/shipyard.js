import { atom, selector, useRecoilValue, useRecoilState, useRecoilCallback } from 'recoil'
import store from './atoms'
import { capitalSelector } from './planets'
import shipData from '../data/ships.json'

export const shipBlueprints = atom({
	key: 'shipBlueprints',
	default: shipData
})

export const useBuyShip = (player) => {
	const ships = useRecoilValue(shipBlueprints)
	const [ capital, setCapital ] = useRecoilState(capitalSelector(player))

	return (key) => {
		const ship = ships[key]
		console.log(capital, ship)

		if (capital.resources.credits > ship.cost)
		{
			const resources = { ...capital.resources }
			resources.credits = resources.credits - ship.cost

			setCapital({ ...capital, resources: resources })
			// set(store.ships(1), { ...ship })
		}
		else
		{
			console.log("not enough credits on home planet")
		}
	}
}

export const useBuyShip_OLD = (player, key) => {
	return useRecoilCallback(({ snapshot, set }) => key => {
		const ships = snapshot.getLoadable(shipBlueprints).contents
		const game = snapshot.getLoadable(store.game).contents
		const planet = snapshot.getLoadable(store.planets(game.players.find(p => p.type === 'human').capitalPlanet)).contents
		// why is key not set?
		console.log(planet, key)
		const ship = ships[key]
		if (planet.resources.credits > ship.cost)
		{
			const resources = { ...planet.resources }
			resources.credits = resources.credits - ship.cost

			set(store.planets(planet.id), { ...planet, resources: resources })
			set(store.ships(1), { ...ship })
		}
		else
		{
			console.log("not enough credits on home planet")
		}
		return () => {}
	})
}