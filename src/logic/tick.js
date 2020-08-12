import React, { useEffect } from 'react'
import { useRecoilValue, useRecoilCallback } from 'recoil'
import date from './date'
import { terraformPlanet } from './planets'
import store from '../state/atoms'
import { selectPlayer } from '../state/game'

const updateDate = (currentDate, set) => {
	const next = date.next(currentDate)
	set(store.date, next)
	return next
}

const harvestResources = (ship, planet) => {
	const resources = Object.keys(planet.resources)
	const harvest = {}

	planet.resources = { ...planet.resources }

	resources.forEach(resource => {
		const harvest = ship.harvester?.resources[resource]
		const multiplier = planet.multipliers.harvesting[resource]

		if (harvest)
		{
			const change = harvest * multiplier
			console.log(planet.type, resource, harvest, `*${multiplier}`, change, planet.resources[resource])
			planet.resources[resource] = planet.resources[resource] + change
		}
	})
}

const changeSymbol = (current, previous) => {
	const change = current - previous
	let symbol

	if (change === 0)
	{
		symbol = ' '
	}
	else if (change < 0)
	{
		symbol = '-'
	}
	else if (change > 0)
	{
		symbol = '+'
	}

	return symbol
}

const updateShip = (ship, shipOwner, planet, currentDate) => {
	if (ship.heading)
	{
		if (date.equal(ship.heading.arrival, currentDate))
		{
			console.log(`Ship ${ship.name} has arrived at ${ship.heading.to.name || ship.heading.to.id}`)
			ship = { ...ship }
			ship.location = {
				planet: ship.heading.to.id,
				position: 'orbit',
				state: 'inactive'
			}
			ship.heading = false

			if (ship.type === 'Atmosphere Processor')
			{
				if (!planet.habitable)
				{
					const duration = planet.terraformDuration
					const completion = date.add(date.fromDays(duration), currentDate)
					// Start terraforming
					ship.location.position = 'surface'
					ship.location.state = 'active'
					ship.terraforming = {
						duration,
						completion
					}

					console.log(`${ship.name} has started terraforming planet. Will complete by ${date.format(completion)}`)
				}
			}
		}
	}
	else //ship.location.state === 'active'
	{
		switch (ship.type)
		{
			case 'Atmosphere Processor':
			{
				if (ship.location.state === 'active' && ship.terraforming)
				{
					if (date.equal(ship.terraforming.completion, currentDate))
					{
						console.log(`Terraforming of planet ${ship.location.planet} completed.`)

						planet = { ...planet }

						terraformPlanet(shipOwner, planet, 'Planet X')
						console.log("Terraformed planet", planet)

						ship = { ...ship }
						ship.location = {
							planet: planet.id,
							position: 'surface',
							state: 'inactive'
						}
						ship.terraforming = false
					}
				}
				break
			}
			case 'Solar-Satellite Generator':
			{
				if (ship.location.position === 'orbit')
				{
					planet = { ...planet }
					harvestResources(ship, planet);
				}
				break
			}
			case 'Core Mining Station':
			case 'Horticultural Station':
			{
				if (ship.location.position === 'surface' && ship.location.state === 'active')
				{
					planet = { ...planet }
					harvestResources(ship, planet)
				}
				break
			}
			default:
			{
				break
			}
		}
	}

	return [ ship, planet ]
}

const handleCombat = (planet, planetOwner, platoons, date) => {

	return planet
}

const updatePlanet = (planet, planetOwner, date) => {
	if (planet.type !== "Lifeless")
	{
		planet = { ...planet }
		planet.resources = { ...planet.resources }

		let starvation = false

		// Credits are only paid every other tick
		planet.creditTick = 1 - planet.creditTick
		if (planet.creditTick === 1)
		{
			const creditsIncome = planet.population * (planet.creditsPerPop * planet.multipliers.resources.credits)
			planet.resources.credits = planet.resources.credits + creditsIncome
		}

		// handle food
		const foodConsumed = planet.population * (planet.foodPerPop * planet.multipliers.resources.food)
		planet.resources.food = planet.resources.food - foodConsumed

		if (planet.resources.food < 0)
		{
			starvation = true
			planet.resources.food = 0
		}

		console.log("food", planet.population, foodConsumed, planet.resources.food)

		planet.resources.foodChange = changeSymbol(planet.resources.food, planet.resources.previousFood)
		planet.resources.previousFood = planet.resources.food

		// TEST don't log plant A morale/growth
		if (planet.id === 'a')
			return planet

		// handle morale
		const targetMorale = 100 - planet.tax
		console.log("morale target", targetMorale)

		// calculate growth based on morale, but if the planet is out of food the morale defaults to 1
		if (starvation)
		{
			planet.morale = 1
		}
		else
		{
			if (targetMorale < planet.morale)
			{
				planet.morale = planet.morale - 1
			}
			else if (targetMorale > planet.morale)
			{
				planet.morale = planet.morale + 1
			}
		}

		let targetGrowth = 33
		if (starvation)
		{
			targetGrowth = targetGrowth - 7
		}

		targetGrowth = targetGrowth - ((100 - planet.morale) * 0.5) - ((planet.tax / 10) * 3)

		const growthChange = Math.min(Math.abs(planet.growth - targetGrowth), 1)
		console.log("change", planet.growth, targetGrowth, planet.growth - targetGrowth, Math.abs(planet.growth - targetGrowth))
		console.log("growth target", targetGrowth, growthChange, planet.previousGrowth)

		if (starvation)
		{
			planet.growth = targetGrowth
		}
		else if (targetGrowth < planet.growth)
		{
			planet.growth = planet.growth - .5
		}
		else if (targetGrowth > planet.growth)
		{
			planet.growth = planet.growth + .5
		}

		planet.growthChange = changeSymbol(planet.growth, planet.previousGrowth)
		planet.previousGrowth = planet.growth
	}

	return planet
}

const tick = (snapshot, set) => {
	// console.log("callback")
	const nextDate = updateDate({ ...snapshot.getLoadable(store.date).contents }, set)

	const game = snapshot.getLoadable(store.game).contents

	// Cannot update an item more the once within the loop as state changes are not applied immediately.
	// Therefore collect all items and update them.
	let planets = game.planets.map(id => {
		return snapshot.getLoadable(store.planets(id)).contents
	})
	let ships = game.ships.map(id => {
		return snapshot.getLoadable(store.ships(id)).contents
	})
	let platoons = game.platoons.map(id => {
		return snapshot.getLoadable(store.platoons(id)).contents
	})

	// handle ships first as they may arrive at a planet
	// replace the ship array with the potentially modified ships
	ships = ships.map(ship => {
		const player = snapshot.getLoadable(selectPlayer(ship.owner)).contents

		let planetIndex = -1
		if (ship.location && ship.location.planet)
		{
			planetIndex = planets.findIndex(p => p.id === ship.location.planet)
		}

		const [ updatedShip, updatedPlanet ] = updateShip(ship, player, planets[planetIndex], nextDate)

		// replace the plant with the potentially modified planet
		if (updatedPlanet)
		{
			planets[planetIndex] = updatedPlanet
		}

		return updatedShip
	})

	planets = planets.map(planet => {
		const player = snapshot.getLoadable(selectPlayer(planet.owner)).contents

		const platoonsOnPlanet = platoons.filter(p => {
			return (p.location && p.location.planet === planet.id)
		})

		planet = handleCombat(planet, player, platoonsOnPlanet, nextDate)
		planet = updatePlanet(planet, player, platoonsOnPlanet, nextDate)

		// update platoons
		platoonsOnPlanet.forEach(platoon => {
			const index = platoons.findIndex(p => p.id === platoon.id)
			platoons[index] = platoon
		})

		return planet
	})

	ships.forEach(ship => set(store.ships(ship.id), ship))
	planets.forEach(planet => set(store.planets(planet.id), planet))
	platoons.forEach(platoon => set(store.platoons(platoon.id), platoon))
}


const Tick = props => {
	const currentDate = useRecoilValue(store.date)
	const callback = useRecoilCallback(({ snapshot, set }) => () => tick(snapshot, set))

	useEffect(() => {
		// console.log("useEffect")
		setTimeout(callback, 1000)
	}, [currentDate]) // don't pass callback as dependancy...

	return false
}

// Export the component which wraps the tick functionality
export default Tick