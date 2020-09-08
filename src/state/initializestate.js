import { } from 'recoil'
import store from './atoms'
import { viewAtom } from './nav'

const initializeState = (set, newGameData, saveGameData) => {
	console.log("Initialize state")

	if (newGameData)
	{
		const { game, planets, ships, platoons } = newGameData

		// set
		set(store.game, game)

		planets.forEach(p => {
			set(store.planets(p.id), p)
		})

		ships.forEach(ship => {
			set(store.ships(ship.id), ship)
		})

		platoons.forEach(platoon => {
			set(store.platoons(platoon.id), platoon)
		})

		set(store.memory, {})
	}
	else if (saveGameData)
	{
		const parseKey = key => {
			key = key.replace(/"/g, '')
			return isNaN(key) ? key : Number(key)
		}

		Object.keys(saveGameData).forEach(key => {
			// console.log(key, saveGameData[key])
			const parts = key.split('_');
			const name = parts[0]
			const realKey = parseKey(parts[parts.length - 1])
			const atom = store[name]
			// console.log(name, typeof(atom), realKey)
			set(typeof(atom) === 'function' ? atom(realKey) : atom, saveGameData[key])
		})
	}
	else
	{
		throw Error("Invalid game data")
	}

	// FIXME this needs to be better!
	const playerCapital = { id: 'h' }

	let pathName = window.location.pathname
	pathName = pathName.replace(/\/game\/([\d]+)?/, '')

	const location = {
		screen: 'solarsystem',
		planet: playerCapital.id
	}

	if (pathName)
	{
		const match = pathName.match(/([\w]+)\/([\w\d]+)/)
		if (match)
		{
			location.screen = match[1]
			location.planet = match[2]
		}
	}

	set(viewAtom, location)
}

export default initializeState