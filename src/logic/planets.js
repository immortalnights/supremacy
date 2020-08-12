
const random = (min, max) => {
	return Math.floor(Math.random() * (max - min) ) + min
}

const deviation = (base, minDeviation, maxDeviation) => {
	const min = base + (base * -minDeviation)
	const max = base + (base * maxDeviation)
	return random(min, max)
}

export const PLANET_TYPES = [
	{
		id: 0,
		name: "Lifeless",
		harvestingMultiplier: null
	},
	{
		id: 1,
		name: "Volcanic",
		multipliers: {
			resources: {
				growth: 1,
				credits: 1,
				food: 1
			},
			harvesting: {
				food: 1,
				minerals: 5,
				fuel: 3,
				energy: 1,
				credits: 1
			}
		}
	},
	{
		id: 2,
		name: "Desert",
		multipliers: {
			resources: {
				growth: 1,
				credits: 1,
				food: 1
			},
			harvesting: {
				food: 1,
				minerals: 1,
				fuel: 1,
				energy: 5,
				credits: 1
			}
		}
	},
	{
		id: 3,
		name: "Tropical",
		multipliers: {
			resources: {
				growth: 1,
				credits: 1,
				food: 1
			},
			harvesting: {
				food: 5,
				minerals: 1,
				fuel: 1,
				energy: 1,
				credits: 1
			}
		}
	},
	{
		id: 4,
		name: "Metropolis",
		multipliers: {
			resources: {
				growth: 1,
				credits: 3,
				food: 1
			},
			harvesting: {
				food: 1,
				minerals: 1,
				fuel: 1,
				energy: 1
			}
		},
	}
]

export const createPlanet = (id, location) => {
	return {
		id,
		owner: null,
		name: '',
		habitable: false,
		type: "Lifeless",
		population: 0,
		terraformDuration: random(5, 10), // 99

		growth: 0,
		growthChange: '',
		morale: 0,
		tax: 0,
		status: '',
		location,
		resources: {
			credits: 0,
			food: 0,
			foodChange: '',
			minerals: 0,
			fuel: 0,
			energy: 0
		},
		multipliers: false
	}
}

export const terraformPlanet = (player, planet, name) => {
	const type = PLANET_TYPES[random(1, 4)]

	planet.owner = player.id
	planet.name = name
	planet.habitable = true
	planet.type = type.name
	planet.population = random(1500, 3000)
	planet.growth = 0
	planet.previousGrowth = 0
	planet.morale = 100
	planet.tax = 0
	planet.status = ''
	planet.resources = {
		credits: 0,
		food: random(1000, 3000),
		minerals: 20,
		fuels: 150,
		energy: 35
	}
	planet.resources.previousFood = planet.resources.food
	planet.resources.foodChange = ''
	planet.foodPerPop = 0.004
	planet.creditsPerPop = 0.32
	planet.creditTick = 0
	planet.multipliers = {
		resources: { ...type.multipliers.resources },
		harvesting: { ...type.multipliers.harvesting }
	}

	return planet
}

export const claimCapital = (player, planet, name, deviate) => {
	terraformPlanet(player, planet, name)

	// Force the planet type to be Metropolis for capital planets
	const metropolisType = PLANET_TYPES.find(t => t.name === "Metropolis")
	planet.type = metropolisType.name
	planet.harvestingMultiplier = { ...metropolisType.harvestingMultiplier }

	// recacluate initial population and resources based on difficulty
	planet.population = deviation(1500, deviate.min, deviate.max)
	planet.resources = {
		credits: deviation(60000, deviate.min, deviate.max),
		food: 50, //deviation(2500, deviate.min, deviate.max),
		minerals: deviation(3000, deviate.min, deviate.max),
		fuels: deviation(3500, deviate.min, deviate.max),
		energy: deviation(4000, deviate.min, deviate.max)
	}

	player.capitalPlanet = planet.id

	return planet
}