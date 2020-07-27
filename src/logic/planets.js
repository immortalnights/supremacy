
const random = (min, max) => {
	return Math.floor(Math.random() * (max - min) ) + min
}

const deviation = (base, minDeviation, maxDeviation) => {
	const min = base + (base * -minDeviation)
	const max = base + (base * maxDeviation)
	return random(min, max)
}

export const PLANET_TYPES = []

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
		}
	}
}

export const terraformPlanet = (player, planet, name) => {
	planet.owner = player.id
	planet.name = name
	planet.habitable = true
	planet.type = "Metropolis"
	planet.population = random(1500, 3000)
	planet.growth = 1
	planet.moral = 75
	planet.tax = 25
	planet.status = ''
	planet.resources = {
		credits: 0,
		food: random(1000, 3000),
		minerals: 20,
		fuels: 150,
		energy: 35
	}

	return planet
}

export const claimCapital = (player, planet, name, deviate) => {
	terraformPlanet(player, planet, name)
	planet.type = "Metropolis"

	// recacluate initial population and resources based on difficulty
	planet.population = deviation(1500, deviate.min, deviate.max)
	planet.resources = {
		credits: deviation(60000, deviate.min, deviate.max),
		food: deviation(2500, deviate.min, deviate.max),
		minerals: deviation(3000, deviate.min, deviate.max),
		fuels: deviation(3500, deviate.min, deviate.max),
		energy: deviation(4000, deviate.min, deviate.max)
	}

	player.capitalPlanet = planet.id

	return planet
}