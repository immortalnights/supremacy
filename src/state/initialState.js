import store from './atoms'
import { viewAtom } from './nav'
import { createShip } from '../logic/ships'
import shipData from '../data/ships.json'

const claimPlanet = (player, planet, name, pop) => {
	if (!player.capitalPlanet)
	{
		player.capitalPlanet = planet.id
	}

	// validate planet can be claimed
	// validate ship and ship population
	planet.owner = player.id
	planet.name = name
	planet.habitable = true
	planet.population = pop
	planet.growth = .1
	planet.moral = .75
	planet.tax = .5
	planet.status = ''
	planet.resources.credits = 10000

	return planet
}

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

		planets.push({
			id,
			owner: null,
			name: '',
			habitable: false,
			population: 0,
			growth: 0,
			growthChange: '',
			morale: 0,
			tax: 0,
			status: '',
			location: {
				x: 0,
				y: index
			},
			resources: {
				credits: 0,
				food: 0,
				foodChange: '',
				minerals: 0,
				fuel: 0,
				energy: 0
			}
		})
	}

	const playerFleet = [
		{ blueprint: shipData['generator'], name: "Solar 1" },
		{ blueprint: shipData['horticultural'], name: "Farm 1" },
	]

	// AI claims the first planet
	claimPlanet(players[0], planets[0], "EnemyBase", 1000)

	// player claims the last planet
	const playerCapital = claimPlanet(players[1], planets[planets.length - 1], "Starbase", 1000)

	const defaultShips = []

	let shipId = 0
	playerFleet.forEach(item => {
		const ship = createShip(item.blueprint, shipId++, item.name, players[1], playerCapital)
		defaultShips.push(ship)
		game.ships.push(ship.id)
	})

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