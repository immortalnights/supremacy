import store from './atoms'
import { viewAtom } from './nav'
import { createShip } from '../logic/ships'
import { createPlanet, claimCapital } from '../logic/planets'
import shipData from '../data/ships.json'

const initializeState = ({set}) => {
	const players = [
		{
			id: 0,
			type: 'ai',
			capitalPlanet: ''
		},
		{
			id: 1,
			type: 'human',
			capitalPlanet: ''
		}
	]

	const planetCount = 8
	const game = {
		id: 0,
		players: players,
		planets: [],
		nextShipId: 0,
		ships: [],
		nextPlatoonId: 0,
		platoons: []
	}

	const planets = []
	for (let index = 0; index < planetCount; index++)
	{
		const id = (index + 10).toString(36)
		game.planets.push(id)

		planets.push(createPlanet(id, { x: 0, y: index }))
	}

	const playerFleet = [
		{ blueprint: shipData['generator'], name: "Solar 1" },
		{ blueprint: shipData['carrier'], name: "Carrier 1" },
		{ blueprint: shipData['atmos'], name: "Atmos 1" },
	]

	// AI claims the first planet
	claimCapital(players[0], planets[0], "EnemyBase", { min: -.20, max: 0 })

	// player claims the last planet
	const playerCapital = claimCapital(players[1], planets[planets.length - 1], "Starbase", { min: -.1, max: .1})

	const defaultShips = []

	playerFleet.forEach(item => {
		const ship = createShip(item.blueprint, game.nextShipId, item.name, players[1], playerCapital)
		defaultShips.push(ship)
		game.ships.push(ship.id)

		game.nextShipId++
	})
	// console.log("Next ship ID", game.nextShipId)

	let pathName = window.location.pathname
	pathName = pathName.replace(/\/game\/([\d]+)?/, '')

	const location = {
		screen: 'solarsystem',
		planet: null
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

	// set
	set(store.game, game)

	planets.forEach(p => {
		set(store.planets(p.id), p)
	})

	defaultShips.forEach(ship => {
		set(store.ships(ship.id), ship)
	})
}

export default initializeState