import store from './store'

const claimPlanet = (player, planet, name, pop) => {
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
}

const initializeState = ({set}) => {
	const players = [
		{
			id: 0
		},
		{
			id: 1
		}
	]

	const planetCount = 8
	const game = {
		id: 0,
		planets: []
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
	console.log(game)

	// AI claims the first planet
	claimPlanet(players[0], planets[0], "EnemyBase", 1000)

	// player claims the last planet
	claimPlanet(players[1], planets[planets.length - 1], "Starbase", 1000)

	// set
	set(store.game, game)

	planets.forEach(p => {
		set(store.planets(p.id), p)
	})
}

export default initializeState