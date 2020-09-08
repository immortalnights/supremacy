import React, { useCallback, useEffect } from 'react'
import { atom, useRecoilValue, useRecoilCallback } from 'recoil'
import { random } from './general'
import dates from './date'
import store, { GAME_START_YEAR } from '../state/atoms'
import { selectAIPlayer } from '../state/game'
import { useSetTax, useTransferCredits, useChangeAggression } from '../state/planets'
import { useBuyShip } from '../state/shipyard'
import { useSendShipToDestination, useSendAtmos } from '../state/ships'


// const govern = ({ planet, ships, platoons }) => {
// 	const requests = []

// 	// identify ships on the surface
// 	const shipsOnPlanet = ships.filter(s => s.location.planet === p.id && s.location.position === 'surface')

// 	if (shipsOnPlanet.length < 6)
// 	{
// 		if (shipsOnPlanet.length  === 0)
// 		{
// 			console.log("AI", `planet ${planet.id} does not have any harvesting ships`)
// 		}

// 		let farming = 0
// 		let mininig = 0

// 		if (planet.type === 'Volcanic' || planet.type === 'Desert')
// 		{
// 			farming = 2
// 			mining = 2
// 		}
// 		else if (planet.type === 'Tropical' || planet.type === 'Metropolis')
// 		{
// 			farming = 4
// 			mininig = 2
// 		}

// 		const farmers = shipsOnPlanet.filter(s => s.type === "Core Mining Station")
// 		const miners = shipsOnPlanet.filter(s => s.type === "Horticultural Station")

// 		if (farmers.length < farming)
// 		{
// 			console.log("AI Governer", `planet ${planet.id} requires a horticultural station`)
// 		}

// 		if (miners.length < mining)
// 		{
// 			console.log("AI Governer", `planet ${planet.id} requires a core mining station`)
// 		}
// 	}
// }

const nextActionDate = (date, difficulty) => {
	const wait = dates.fromDays(random(dates.YEAR_LENGTH * 1.5, dates.YEAR_LENGTH * 2.5) * difficulty)
	const next = dates.add(date, wait)
	console.log("AI", `Next action ${next.d} / ${next.y}`)
	return next
}


const compute = ({ date, memory, game, planets, ships, platoons }) => {
	let tasks = []

	const me = game.players.find(p => p.type === 'ai')

	// AI does not look after it's planets
	planets.forEach(p => {
		if (p.owner === me.id)
		{
			// const requests = govern({ planet, ships, platoons })
			// console.log("AI", `govener for planet ${planet.id} made ${requests.length} requests`)
		}
	})


	if (!memory.initialized)
	{
		// AI does not perform any action for a random amount of time from the start of the game
		// TODO time to very based on AI difficultly
		memory = { ...memory }
		memory.initialized = true
		memory.nextAction = nextActionDate(date, 1)
	}

	// AI doesn't do anything for two game years
	if (dates.diff(date, memory.nextAction) > 0)
	{
		// console.log("AI", `Waiting until later...`, memory.nextAction)
	}
	else
	{
		// Check if the AI owns a Terraformer, if not request one
		const terraformer = ships.find(s => s.type === 'Atmosphere Processor')
		if (!terraformer)
		{
			// Should not do this twice as the purchase will succeed
			console.log("AI", `Requests the purchase of a Atmos`)
			tasks.push({
				type: 'ship:purchase',
				ref: 'Atmosphere Processor'
			})
		}
		else if (terraformer.heading || terraformer.terraforming)
		{
			// console.log("AI", `Atmosphere Processor is currently busy`)
			memory = { ...memory }
			memory.nextAction = nextActionDate(date, 1)
		}
		else
		{
			// find the next planet to expand to
			const next = planets.find(p => p.owner !== me.id)

			if (next)
			{
				if (next.owner === null)
				{
					console.log("AI", `Next planet (${next.id}) is lifeless, sending terraformer`)

					tasks.push({
						type: 'ship:terraform',
						ref: next.id
					})
				}
				else
				{
					console.log("AI", `Next planet (${next.id}) is owned, send attack wave`)

					tasks.push({
						type: 'invade',
						ref: next.id
					})
				}

				memory = { ...memory }
				memory.lastAction = { ...date }
				memory.nextAction = nextActionDate(date, 1)
			}
		}
	}

	return [tasks, memory]
}

const AI = props => {
	const me = useRecoilValue(selectAIPlayer)
	const setTax = useSetTax()
	const buyShip = useBuyShip(me)
	const sendAtmos = useSendAtmos(me)

	const callback = useRecoilCallback(({ snapshot, set }) => () => {
		const memory = snapshot.getLoadable(store.memory).contents
		const date = snapshot.getLoadable(store.date).contents
		const game = snapshot.getLoadable(store.game).contents

		const planets = game.planets.map(id => {
			return snapshot.getLoadable(store.planets(id)).contents
		})

		const ships = []
		game.ships.forEach(id => {
			// Only provide the AI with it's own ships
			const ship = snapshot.getLoadable(store.ships(id)).contents
			if (ship.owner === me.id)
			{
				ships.push(ship)
			}
		})

		const platoons = []
		game.platoons.forEach(id => {
			// Only provide the AI with it's own platoons
			const platoon = snapshot.getLoadable(store.platoons(id)).contents
			if (platoon.owner === me.id)
			{
				platoons.push(platoon)
			}
		})

		const [ tasks, mem ] = compute({
			date,
			memory,
			game,
			planets,
			ships,
			platoons
		})

		set(store.memory, mem)

		while (tasks.length > 0)
		{
			const task = tasks.pop()

			switch (task.type)
			{
				case 'ship:purchase':
				{
					switch (task.ref)
					{
						case 'Atmosphere Processor':
						{
							buyShip('atmos', "AI Atmos")
							break
						}
						default:
						{
							console.warn("AI", `Attempting to buy ship '${task.ref}'`)
							break
						}
					}
					break;
				}
				case 'ship:terraform':
				{
					sendAtmos({ id: task.ref })
					break;
				}
				case 'invade':
				{
					break
				}
				default:
				{
					console.warn("AI", `Unknown task ${task.type}`)
					break
				}
			}
		}
	})

	useEffect(() => {
		const timer = setInterval(callback, 500)

		return () => {
			clearInterval(timer)
		}
	});

	return null
}

export default AI