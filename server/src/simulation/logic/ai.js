import React, { useCallback, useEffect } from "react"
import { atom, useRecoilValue, useRecoilCallback } from "recoil"
import { random } from "./general"
import planetNames from "../data/planetnames"
import dates from "./date"
import store, { GAME_START_YEAR } from "../state/atoms"
import { selectAIPlayer } from "../state/game"
import {
    selectPlayerCapitalPlanet,
    useSetTax,
    useTransferCredits,
    useChangeAggression,
} from "../state/planets"
import { useBuyShip } from "../state/shipyard"
import {
    useChangeShipPosition,
    useSendShipToDestination,
    useSendAtmos,
} from "../state/ships"
import { useCommissionPlatoon, useTransferPlatoon } from "../state/platoons"

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
    // random(dates.YEAR_LENGTH * .25, dates.YEAR_LENGTH * .75) * difficulty
    const wait = dates.fromDays(4)
    const next = dates.add(date, wait)
    console.log("AI", `Next action ${next.d} / ${next.y}`)
    return next
}

const compute = ({ date, memory, game, planets, ships, platoons }) => {
    let tasks = []

    const me = game.players.find((p) => p.type === "ai")
    const capital = planets.find((p) => p.id === me.capitalPlanet)

    // AI does not look after it's planets
    planets.forEach((p) => {
        if (p.owner === me.id) {
            // const requests = govern({ planet, ships, platoons })
            // console.log("AI", `govener for planet ${planet.id} made ${requests.length} requests`)
        }
    })

    if (!memory.initialized) {
        // AI does not perform any action for a random amount of time from the start of the game
        // TODO time to very based on AI difficultly
        memory = { ...memory }
        memory.initialized = true
        memory.nextAction = nextActionDate(date, 1)
    }

    // AI doesn't do anything for two game years
    if (dates.diff(date, memory.nextAction) > 0) {
        // console.log("AI", `Waiting until later...`, memory.nextAction)
    } else if (memory.invasion) {
        let invasion = { ...memory.invasion }
        const ship = ships.find((s) => {
            return invasion.ship === s.id || s.type === "B-29 Battle Cruiser"
        })

        if (ship && ship.heading) {
            console.log("AI", "Invasion ship is still travelling")
            return [tasks, memory]
        }

        console.log("AI", "Invasion", invasion)
        switch (invasion.phase) {
            case "prepare": {
                if (ship) {
                    invasion.ship = ship.id

                    if (ship.crew === 0) {
                        tasks.push({
                            type: "ship:crew",
                            ref: ship.id,
                        })
                    }

                    if (ship.fuel < ship.capacity.fuel) {
                        tasks.push({
                            type: "ship:refuel",
                            ref: ship.id,
                        })
                    }
                    if (ship.location.planet === capital.id) {
                        if (ship.location.position === "docked") {
                            invasion.phase = "platoon:prepare"
                        } else {
                            invasion.phase = "return:land"
                        }
                    } else {
                        if (ship.location.position === "docked") {
                            invasion.phase = "return:launch"
                        } else {
                            invasion.phase = "return:travel"
                        }
                    }
                } else {
                    tasks.push({
                        type: "ship:purchase",
                        ref: "B-29 Battle Cruiser",
                    })

                    invasion.phase = "platoon:prepare"
                }
                break
            }
            case "return:launch": {
                tasks.push({
                    type: "ship:launch",
                    ref: invasion.ship,
                })
                invasion.phase = "return:travel"
                break
            }
            case "return:travel": {
                tasks.push({
                    type: "ship:travel",
                    ref: invasion.ship,
                    destination: capital.id,
                })
                invasion.phase = "return:land"
                break
            }
            case "return:land": {
                tasks.push({
                    type: "ship:land",
                    ref: invasion.ship,
                })
                invasion.phase = "platoon:prepare"
                break
            }
            case "platoon:prepare": {
                const first = platoons.find((p) => p.name === "1st")
                const other = platoons.find(
                    (p) => p.id !== first.id && p.commissioned === false
                )

                tasks.push({
                    type: "platoon:prepare",
                    ref: other.id,
                    troops: Math.min(first.troops * 0.1, 80, first.troops),
                })
                invasion.phase = "platoon:commission"
                invasion.platoon = other.id
                break
            }
            case "platoon:commission": {
                tasks.push({
                    type: "platoon:commission",
                    ref: invasion.platoon,
                })
                invasion.phase = "platoon:load"
                break
            }
            case "platoon:load": {
                tasks.push({
                    type: "platoon:load",
                    platoon: invasion.platoon,
                    ship: invasion.ship,
                })
                invasion.phase = "invade:launch"
                break
            }
            case "invade:launch": {
                tasks.push({
                    type: "ship:launch",
                    ref: invasion.ship,
                })
                invasion.phase = "invade:travel"
                break
            }
            case "invade:travel": {
                tasks.push({
                    type: "ship:travel",
                    ref: invasion.ship,
                    destination: invasion.target,
                })
                invasion.phase = "invade:land"
                break
            }
            case "invade:land": {
                tasks.push({
                    type: "ship:land",
                    ref: invasion.ship,
                })
                invasion.phase = "platoon:unload"
                break
            }
            case "platoon:unload": {
                tasks.push({
                    type: "platoon:unload",
                    platoon: invasion.platoon,
                    ship: invasion.ship,
                    planet: invasion.target,
                })
                invasion.phase = "invade:combat"
                break
            }
            case "invade:combat": {
                const platoon = platoons.find((p) => p.id === invasion.platoon)
                if (platoon.troops > 0) {
                    // In progress
                } else {
                }

                invasion = null
                break
            }
        }

        memory = { ...memory }
        memory.invasion = invasion
        memory.lastAction = { ...date }
        memory.nextAction = nextActionDate(date, 1)
    } else {
        // Check if the AI owns a Terraformer, if not request one
        const terraformer = ships.find((s) => s.type === "Atmosphere Processor")
        if (!terraformer) {
            // Should not do this twice as the purchase will succeed
            console.log("AI", `Requests the purchase of a Atmos`)
            tasks.push({
                type: "ship:purchase",
                ref: "Atmosphere Processor",
            })
        } else if (terraformer.heading || terraformer.terraforming) {
            // console.log("AI", `Atmosphere Processor is currently busy`)
            memory = { ...memory }
            memory.nextAction = nextActionDate(date, 1)
        } else {
            // find the next planet to expand to
            const next = planets.find((p) => p.owner !== me.id)

            if (next) {
                memory = { ...memory }

                if (next.owner === null) {
                    console.log(
                        "AI",
                        `Next planet (${next.id}) is lifeless, sending terraformer`
                    )

                    const nameIndex =
                        memory.nameIndex === undefined ? 1 : memory.nameIndex

                    tasks.push({
                        type: "ship:terraform",
                        ref: next.id,
                        name: planetNames[nameIndex],
                    })

                    memory.nameIndex = nameIndex + 1
                } else {
                    console.log(
                        "AI",
                        `Next planet (${next.id}) is owned, planning attack wave`
                    )
                    memory.invasion = {
                        target: next.id,
                        phase: "prepare",
                    }
                }

                memory.lastAction = { ...date }
                memory.nextAction = nextActionDate(date, 1)
            }
        }
    }

    return [tasks, memory]
}

const AI = (props) => {
    const me = useRecoilValue(selectAIPlayer)
    const capital = useRecoilValue(selectPlayerCapitalPlanet(me))
    const setTax = useSetTax()
    const buyShip = useBuyShip(me)
    const sendAtmos = useSendAtmos(me)
    const repositionShip = useChangeShipPosition(me)
    const sendShip = useSendShipToDestination(me)
    const commission = useCommissionPlatoon(me, capital)
    const transferPlatoon = useTransferPlatoon(me)

    const callback = useRecoilCallback(({ snapshot, set }) => () => {
        const memory = snapshot.getLoadable(store.memory).contents
        const date = snapshot.getLoadable(store.date).contents
        const game = snapshot.getLoadable(store.game).contents

        const planets = game.planets.map((id) => {
            return snapshot.getLoadable(store.planets(id)).contents
        })

        const ships = []
        game.ships.forEach((id) => {
            // Only provide the AI with it's own ships
            const ship = snapshot.getLoadable(store.ships(id)).contents
            if (ship.owner === me.id) {
                ships.push(ship)
            }
        })

        const platoons = []
        game.platoons.forEach((id) => {
            // Only provide the AI with it's own platoons
            const platoon = snapshot.getLoadable(store.platoons(id)).contents
            if (platoon.owner === me.id) {
                platoons.push(platoon)
            }
        })

        const [tasks, mem] = compute({
            date,
            memory,
            game,
            planets,
            ships,
            platoons,
        })

        set(store.memory, mem)

        while (tasks.length > 0) {
            const task = tasks.pop()

            console.log("Task:", task)

            switch (task.type) {
                case "ship:purchase": {
                    switch (task.ref) {
                        case "Atmosphere Processor": {
                            buyShip("atmos", "AI Atmos")
                            break
                        }
                        case "B-29 Battle Cruiser": {
                            buyShip("battlecruiser", "AI Battle")
                            break
                        }
                        default: {
                            console.warn(
                                "AI",
                                `Attempting to buy ship '${task.ref}'`
                            )
                            break
                        }
                    }
                    break
                }
                case "ship:crew": {
                    const ship = { ...ships.find((s) => s.id === task.ref) }
                    ship.crew = ship.requiredCrew
                    set(store.ships(ship.id), ship)
                    break
                }
                case "ship:refuel": {
                    const ship = { ...ships.find((s) => s.id === task.ref) }
                    ship.fuel = ship.capacity.fuel
                    set(store.ships(ship.id), ship)
                    break
                }
                case "ship:terraform": {
                    sendAtmos({ id: task.ref }, task.name)
                    break
                }
                case "ship:launch": {
                    repositionShip({ id: task.ref }, "orbit")
                    break
                }
                case "ship:travel": {
                    sendShip({ id: task.ref }, { id: task.destination })
                    break
                }
                case "ship:land": {
                    repositionShip({ id: task.ref }, "docked")
                    break
                }
                case "platoon:prepare": {
                    const first = { ...platoons.find((p) => p.name === "1st") }
                    const other = { ...platoons.find((p) => p.id === task.ref) }

                    first.troops = first.troops - task.troops
                    other.suit = "suit_1"
                    other.weapon = "weapon_1"
                    other.troops = other.troops + task.troops

                    set(store.platoons(first.id), first)
                    set(store.platoons(other.id), other)

                    break
                }
                case "platoon:commission": {
                    const other = platoons.find((p) => p.id === task.ref)

                    commission(other)
                    break
                }
                case "platoon:load": {
                    const ship = ships.find((s) => s.id === task.ship)
                    const platoon = platoons.find((p) => p.id === task.platoon)

                    transferPlatoon("load", platoon, capital, ship)
                    break
                }
                case "platoon:unload": {
                    const ship = ships.find((s) => s.id === task.ship)
                    const platoon = platoons.find((p) => p.id === task.platoon)
                    const planet = planets.find((p) => p.id === task.planet)

                    transferPlatoon("unload", platoon, planet, ship)
                    break
                }
                default: {
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
    })

    return null
}

export default AI
