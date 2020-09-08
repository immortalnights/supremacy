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
			// console.log(planet.type, resource, harvest, `*${multiplier}`, change, planet.resources[resource])
			planet.resources[resource] = planet.resources[resource] + change
		}
	})
}

const changeSymbol = (current, previous, sym) => {
	const change = current - previous
	let symbol

	if (change === 0)
	{
		symbol = sym
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
		if (date.lessThen(ship.heading.arrival, currentDate))
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
					const duration = planet.terraformDuration * 10
					const completion = date.add(date.fromDays(duration), currentDate)

					planet = { ...planet }
					planet.terraforming = true

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
					if (date.lessThen(ship.terraforming.completion, currentDate))
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
				if (ship.location.position === 'orbit' && ship.owner === planet.owner)
				{
					planet = { ...planet }
					harvestResources(ship, planet);
				}
				break
			}
			case 'Core Mining Station':
			case 'Horticultural Station':
			{
				if (ship.location.position === 'surface' && ship.location.state === 'active' && ship.owner === planet.owner)
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

	// Split the platoons by player
	const attackers = []
	const defenders = []
	// Clone the platoon array for modification
	platoons = [ ...platoons ]

	platoons.forEach(platoon => {
		if (platoon.owner === planet.owner)
		{
			defenders.push(platoon)
		}
		else
		{
			attackers.push(platoon)
		}
	})

	// Handle planet combat if the planet has attackers, defenders are optional
	if (attackers.length > 0)
	{
		const attackersStrength = attackers.reduce((p, t) => t + p.strength, 0)
		const defendersStrength = defenders.reduce((p, t) => t + p.strength, 0)

		// handle combat
		if (defenders.length > 0)
		{
			

		}

		if (defenders.length === 0)
		{
			console.log(`Planet {planet.id} has been conquered`)
		}
	}

	return [ planet, platoons ]
}

const updatePlanet = (planet, planetOwner, platoons, date) => {
	if (planet.type !== "Lifeless")
	{
		planet = { ...planet }
		planet.resources = { ...planet.resources }

		let starvation = false
		const oddDate = (date.d % 2) !== 0

		// Credits are only paid every other tick
		if (oddDate)
		{
			const taxPerPop = ((planet.creditsPerPop * planet.multipliers.resources.credits) * (planet.tax / 100))
			const creditsIncome = planet.population * taxPerPop
			planet.resources.credits = planet.resources.credits + creditsIncome
			// console.log("Tax", taxPerPop, creditsIncome, planet.resources.credits)
		}

		// handle food
		const foodConsumed = planet.population * (planet.foodPerPop * planet.multipliers.resources.food)
		planet.resources.food = planet.resources.food - foodConsumed

		if (planet.resources.food < 0)
		{
			starvation = true
			planet.resources.food = 0
		}

		// console.log("Food", planet.population, foodConsumed, planet.resources.food)

		planet.resources.foodChange = changeSymbol(planet.resources.food, planet.resources.previousFood, planet.resources.foodChange)
		planet.resources.previousFood = planet.resources.food

		// handle morale
		const targetMorale = 100 - planet.tax
		// console.log("Morale target", targetMorale)

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

		const baseGrowth = -50 * (planet.tax / 100)
		const targetGrowth = 33 * (planet.morale / 100)
		// console.log("Base", baseGrowth, "Target", targetGrowth, '=', baseGrowth + targetGrowth)

		const diff = targetGrowth - planet.growthAdjustment
		// console.log(diff, planet.growthAdjustment)
		if (targetGrowth < planet.growthAdjustment)
		{
			planet.growthAdjustment = planet.growthAdjustment - Math.min(Math.abs(diff), 1)
		}
		else if (targetGrowth > planet.growthAdjustment)
		{
			planet.growthAdjustment = planet.growthAdjustment + Math.min(Math.abs(diff), 1)
		}

		planet.growth = Math.ceil(baseGrowth + planet.growthAdjustment)

		if (targetGrowth < planet.growth)
		{
			planet.growth = planet.growth - .5
		}
		else if (targetGrowth > planet.growth)
		{
			planet.growth = planet.growth + .5
		}

		planet.growthChange = changeSymbol(planet.growth, planet.previousGrowth, planet.growthChange)
		planet.previousGrowth = planet.growth

		// update population
		if (oddDate)
		{
			const populationGrowth = ((planet.population / 4) * (planet.growth / 100))
			planet.population = planet.population + populationGrowth

			if (planet.population < 1)
			{
				planet.population = 0
			}
			else if (planet.population > 30000)
			{
				planet.population = 30000
			}

			// console.log("Growth", planet.growth, populationGrowth, planet.population)
		}
	}

	return planet
}

const tick = (snapshot, set) => {
	// console.log("callback")
	const nextDate = updateDate({ ...snapshot.getLoadable(store.date).contents }, set)

	const game = snapshot.getLoadable(store.game).contents

	// players is read-only
	const players = game.players

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
		const player = players.find(player => player.id === ship.owner)

		let planetIndex = -1
		if (ship.heading && ship.heading.to)
		{
			planetIndex = planets.findIndex(p => p.id === ship.heading.to.id)
		}
		else if (ship.location && ship.location.planet)
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

	// handle planets, combat is resolved before planet updates
	planets = planets.map(planet => {
		const player = players.find(player => player.id === planet.owner)

		const platoonsOnPlanet = platoons.filter(p => {
			return (p.location && p.location.planet === planet.id)
		})

		// FIXME

		let r = handleCombat(planet, player, platoonsOnPlanet, nextDate)
		// FIXME again
		planet = r[0]
		planet = updatePlanet(planet, player, platoonsOnPlanet, nextDate)

		// update platoons
		platoonsOnPlanet.forEach(platoon => {
			const index = platoons.findIndex(p => p.id === platoon.id)
			platoons[index] = platoon
		})

		return planet
	})

	platoons = platoons.map(platoon => {
		if (platoon)
		{
			if (platoon.commissioned === false)
			{
				if (platoon.troops > 0 && platoon.calibre < 100)
				{
					platoon = { ...platoon }

					if (platoon.troopChange > 0)
					{
						// Loose 1% per new troop added
						platoon.calibre = platoon.calibre - platoon.troopChange
					}

					// train 3% per tick
					platoon.calibre = platoon.calibre + 3

					platoon.calibre = Math.max(platoon.calibre, 0)
					platoon.calibre = Math.min(platoon.calibre, 100)
				}
				else if (platoon.troops === 0 && platoon.calibre > 0)
				{
					// Reset the clibre if the platoon is emptied
					platoon = { ...platoon }
					platoon.calibre = 0
				}
			}
			else if (platoon.troops === 0)
			{
				// Disband
				platoon.commissioned = false
				platoon.troopChange = 0
				platoon.calibre = 0
			}
		}

		return platoon
	})



	// Display changes to AI capital planet for AI debugging
	// const track = planets.find(p => p.id === 'a')
	// console.log(track.tax)

	ships.forEach(ship => set(store.ships(ship.id), ship))
	planets.forEach(planet => set(store.planets(planet.id), planet))
	platoons.forEach(platoon => set(store.platoons(platoon.id), platoon))
}

const Tick = props => {
	const currentDate = useRecoilValue(store.date)
	const settings = useRecoilValue(store.settings)
	const callback = useRecoilCallback(({ snapshot, set }) => () => {
		tick(snapshot, set)
	})

	useEffect(() => {
		// console.log("useEffect")
		const timer = setTimeout(callback, settings.speed)

		return () => {
			clearTimeout(timer)
		}
	}, [currentDate]) // don't pass callback as dependency...

	return false
}

// Export the component which wraps the tick functionality
export default Tick