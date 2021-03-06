import { createShip } from '../logic/ships'
import { createPlanet, claimCapital } from '../logic/planets'
import { MAXIMUM_PLATOONS, createPlatoon } from '../logic/platoons'
import shipData from '../data/ships.json'
import equipmentData from '../data/equipment.json'

const newGameState = options => {
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

	const human = players[1]
	const ai = players[0]

	const planetCount = 8
	const game = {
		id: 0,
		players: players,
		planets: [],
		nextShipId: 0,
		ships: [],
		platoons: [],
		startDateTime: new Date().toString(),
		finished: false
	}

	const planets = []
	for (let index = 0; index < planetCount; index++)
	{
		const id = (index + 10).toString(36)
		game.planets.push(id)

		planets.push(createPlanet(id, { x: 0, y: index }))
	}

	const playerFleet = []

	// AI claims the first planet
	const aiCapital = claimCapital(ai, planets[0], "EnemyBase", { min: -.20, max: 0 })

	// player claims the last planet
	const playerCapital = claimCapital(human, planets[planets.length - 1], "Starbase", { min: -.1, max: .1})

	const ships = []

	playerFleet.forEach(item => {
		const ship = createShip(item.blueprint, game.nextShipId, item.name, human, playerCapital)
		ships.push(ship)
		game.ships.push(ship.id)

		game.nextShipId++
	})
	// console.log("Next ship ID", game.nextShipId)

	const equipmentKeys = Object.keys(equipmentData);
	// console.log(equipmentKeys)
	const firstSuit = equipmentKeys.find(key => equipmentData[key].type === 'suit')
	const firstWeapon = equipmentKeys.find(key => equipmentData[key].type === 'weapon')

	const platoons = []
	let platoonId = 0
	for (let playerIndex = 0; playerIndex < players.length; playerIndex++)
	{
		const owner = players[playerIndex]
		for (let p = 1; p <= MAXIMUM_PLATOONS; p++)
		{
			const platoon = createPlatoon(platoonId++, owner, p, firstSuit, firstWeapon)
			game.platoons.push(platoon.id)

			platoons.push(platoon)
		}
	}

	// Create initial AI planet defense
	const platoon = platoons.find(platoon => platoon.owner === ai.id)
	platoon.commissioned = true
	platoon.calibre = 100
	platoon.troops = 1560
	platoon.unitStrength = 2 // level 1 armor and weapon
	platoon.location = {
		planet: aiCapital.id
	}

	return {
		game,
		players,
		planets,
		ships,
		platoons
	}
}

export default newGameState