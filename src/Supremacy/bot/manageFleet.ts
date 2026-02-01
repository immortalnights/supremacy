import type { BotPlayer, BotActionObject, ActionPriority } from "../types"
import type { ColonizedPlanet, Ship, Platoon, ShipClass, Planet, Resource } from "../entities"
import { shipLimits } from "./consts"
import type { BotDifficulty } from "./types"
import { pushAction } from "./utils"

// Each Bot is limited to a number of ships of a specific class based on their difficulty
// TODO: Also consider the planet type
const getStationLimit = (cls: ShipClass, planet: ColonizedPlanet, botDifficulty: BotDifficulty) => {
    const min = cls === "Horticultural Station" ? Math.ceil(planet.population / 3000) : 0
    const max = shipLimits[cls][botDifficulty]
    return [min, max]
}

const getSolarLimit = (activeStations: number, planet: ColonizedPlanet, botDifficulty: BotDifficulty) => {
    let min = 0
    if (activeStations > 0) {
        min = Math.ceil((activeStations * 1) / 4)
    } else if (planet.capital || planet.type === "dessert") {
        min = 1
    }
    const max = shipLimits["Solar-Satellite Generator"][botDifficulty]
    return [min, max]
}

const manageStationsAtPlanet = (
    planet: ColonizedPlanet,
    activeShips: Ship[],
    inactiveShips: Ship[],
    priority: ActionPriority,
): BotActionObject | undefined => {
    let action: BotActionObject | undefined = undefined

    console.debug(
        `Planet ${planet.name} has ${activeShips.length}/${activeShips.length + inactiveShips.length} active stations`,
    )

    if (inactiveShips.length > 0) {
        // Find ship to activate
        const shipToActivate = inactiveShips.find((ship) => ship.position === "surface" && !ship.active)

        const shipToTransition = inactiveShips.find(
            (ship) => ship.position === "docked" && ship.crew === ship.requiredCrew,
        )

        const shipToCrew = inactiveShips.find((ship) => ship.position === "docked" && ship.crew !== ship.requiredCrew)

        const shipToLand = inactiveShips.find((ship) => ship.position === "orbit")

        // Set action based on which is closest to completion
        if (shipToActivate) {
            // Activate any horticultural stations on the surface
            action = {
                type: "ship-toggle",
                payload: {
                    id: shipToActivate.id,
                    active: true,
                },
                playerId: planet.owner,
                priority,
            }
        } else if (shipToTransition) {
            action = {
                type: "ship-reposition",
                payload: {
                    id: shipToTransition.id,
                    destination: "surface",
                },
                playerId: planet.owner,
                priority,
            }
        } else if (shipToCrew) {
            // FIXME this should be known, if the ship class has been identified?
            if (shipToCrew.requiredCrew !== "remote") {
                action = {
                    type: "ship-crew",
                    payload: {
                        id: shipToCrew.id,
                        crew: shipToCrew.requiredCrew,
                    },
                    playerId: planet.owner,
                    priority,
                }
            }
        } else if (shipToLand) {
            // FIXME this should be known, if the ship class has been identified?
            action = {
                type: "ship-reposition",
                payload: {
                    id: shipToLand.id,
                    destination: "docked",
                },
                playerId: planet.owner,
                priority,
            }
        } else {
            console.error(
                `Have inactive stations (${inactiveShips.length}), but no action identified for it on planet ${planet.name}`,
            )
        }
    }

    return action
}

const manageStations = (
    planet: ColonizedPlanet,
    shipClass: ShipClass,
    stations: Ship[],
    capital: ColonizedPlanet,
    botDifficulty: BotDifficulty,
    priority: ActionPriority,
): BotActionObject | undefined => {
    let action: BotActionObject | undefined

    const shipsAtPlanet = stations.filter(
        (ship) => ship.position !== "outer-space" && ship.location.planet === planet.id,
    )

    // console.debug(`Planet ${planet.name} has ${stations.length} ${shipClass}s`)

    const { activeShips, inactiveShips } = shipsAtPlanet.reduce<{
        activeShips: Ship[]
        inactiveShips: Ship[]
    }>(
        (acc, ship) => {
            if (ship.position === "surface" && ship.active) {
                acc.activeShips.push(ship)
            } else {
                acc.inactiveShips.push(ship)
            }
            return acc
        },
        {
            activeShips: [],
            inactiveShips: [],
        },
    )

    const [min, max] = getStationLimit(shipClass, planet, botDifficulty)

    // If the planet doesn't have the minimum stations, and there is available inactive ones,
    if (activeShips.length < min && activeShips.length < max) {
        console.log(
            `Below minimum (${min}) threshold for active ${shipClass} on planet`,
            planet.name,
            `(${shipsAtPlanet.length}/${activeShips.length}/${min})`,
        )

        if (inactiveShips.length > 0) {
            action = manageStationsAtPlanet(planet, activeShips, inactiveShips, priority)
        } else if (planet.capital) {
            // Don't transfer to the capital from other planets
            action = {
                type: "ship-purchase",
                payload: {
                    class: shipClass,
                    name: undefined,
                },
                playerId: planet.owner,
                priority,
            }
        } else {
            const inbound = stations.filter((ship) => ship.position === "outer-space" && ship.heading.to === planet.id)

            if (inbound) {
                // Do nothing for this planet until it arrives
            } else {
                // Exclude ships that are active
                const stationsAtCapital = stations.filter(
                    (ship) =>
                        ship.position !== "outer-space" &&
                        ship.position !== "surface" &&
                        ship.location.planet !== capital.id,
                )

                // If a ship is in orbit, it might actually be "assigned" to another planet, but that is not handled at this time.
                const { docked, inOrbit } = stationsAtCapital.reduce<{
                    docked: Ship[]
                    inOrbit: Ship[]
                }>(
                    (acc, ship) => {
                        if (ship.position === "docked" && ship.location.planet !== planet.id) {
                            acc.docked.push(ship)
                        } else if (ship.position === "orbit" && ship.location.planet !== planet.id) {
                            acc.inOrbit.push(ship)
                        }
                        return acc
                    },
                    {
                        docked: [],
                        inOrbit: [],
                    },
                )

                if (docked.length > 0) {
                    action = {
                        type: "ship-reposition",
                        payload: {
                            id: docked[0].id,
                            destination: "orbit",
                        },
                        playerId: planet.owner,
                        priority,
                    }
                } else if (inOrbit.length > 0) {
                    action = {
                        type: "ship-transfer",
                        payload: {
                            id: docked[0].id,
                            destination: planet.id,
                        },
                        playerId: planet.owner,
                        priority,
                    }
                } else {
                    // This planet has no available stations, try to purchase one.
                    console.debug(`No ${shipClass} available for planet ${planet.name}, purchasing one`)
                    action = {
                        type: "ship-purchase",
                        payload: {
                            class: shipClass,
                            name: undefined,
                        },
                        playerId: planet.owner,
                        priority,
                    }
                }
            }
        }
    }
    return action
}

const manageSolarSatellites = (
    planet: ColonizedPlanet,
    solarSatellites: Ship[],
    capital: ColonizedPlanet,
    botDifficulty: BotDifficulty,
    activeStations: number,
): BotActionObject | undefined => {
    let action: BotActionObject | undefined
    const [min, max] = getSolarLimit(activeStations, planet, botDifficulty)

    // FIXME this wont handle Solars that are in orbit around the Capital, that are not intended to be moved to another planet...
    // Essentially, other planets will steal the Capital's Solars

    const shipsAtPlanet = solarSatellites.filter(
        (ship) => ship.position !== "outer-space" && ship.location.planet === planet.id,
    )

    // console.debug(`Planet ${planet.name} has ${solarSatellites.length} Solar-Satellites`)

    if (planet.capital) {
        // Only the Capital will have docked Solars
        const { inOrbit, docked } = shipsAtPlanet.reduce<{
            inOrbit: Ship[]
            docked: Ship[]
        }>(
            (acc, ship) => {
                if (ship.position === "orbit") {
                    acc.inOrbit.push(ship)
                } else {
                    acc.docked.push(ship)
                }
                return acc
            },
            {
                inOrbit: [],
                docked: [],
            },
        )

        // If the capital has a docked Solar, launch it
        if (docked.length > 0) {
            action = {
                type: "ship-reposition",
                payload: {
                    id: docked[0].id,
                    destination: "orbit",
                },
                playerId: planet.owner,
                priority: "Medium",
            }
        }
        // If the capital needs more Solars. purchase one
        else if (inOrbit.length < min && inOrbit.length < max) {
            console.debug(`No Solar-Satellite available for capital ${planet.name}, purchasing one`)
            action = {
                type: "ship-purchase",
                payload: {
                    class: "Solar-Satellite Generator",
                    name: undefined,
                },
                playerId: planet.owner,
                priority: "Medium",
            }
        }
    } else {
        // Non-capital
        const inOrbit = shipsAtPlanet.filter((ship) => ship.position === "orbit")
        if (inOrbit.length < min && inOrbit.length < max) {
            // Is the a Solar inbound
            const inbound = solarSatellites.filter(
                (ship) => ship.position === "outer-space" && ship.heading.to === planet.id,
            )

            if (inbound) {
                // Do nothing for this planet until it arrives
            } else {
                // Transfer from Capital, if available, or purchase one

                const atCapital = solarSatellites.filter(
                    (ship) => ship.position === "orbit" && ship.location.planet === capital.id,
                )

                if (atCapital.length > 0) {
                    action = {
                        type: "ship-transfer",
                        payload: {
                            id: atCapital[0].id,
                            destination: planet.id,
                        },
                        playerId: planet.owner,
                        priority: "Medium",
                    }
                } else {
                    console.debug(`No Solar-Satellite available for planet ${planet.name}, purchasing one`)
                    action = {
                        type: "ship-purchase",
                        payload: {
                            class: "Solar-Satellite Generator",
                            name: undefined,
                        },
                        playerId: planet.owner,
                        priority: "Medium",
                    }
                }
            }
        }
    }

    return action
}

export const managePlanetShips = (
    player: BotPlayer,
    ships: Ship[],
    planets: ColonizedPlanet[],
    otherPlanets: Planet[],
    platoons: Platoon[],
): BotActionObject[] => {
    const actions: BotActionObject[] = []

    const capital = planets.find((planet) => planet.capital)

    if (!capital) {
        throw new Error(`Failed to capital for player ${player.id}`)
    }

    // Planet functional ships are managed per-planet
    planets.forEach((planet) => {
        const horticulturalStations = ships.filter(
            (ship) =>
                ship.class === "Horticultural Station" && ship.owner === player.id && ship.position !== "outer-space",
        )

        pushAction(
            manageStations(planet, "Horticultural Station", horticulturalStations, capital, player.difficulty, "High"),
            actions,
        )

        const miningStations = ships.filter(
            (ship) =>
                ship.class === "Core Mining Station" && ship.owner === player.id && ship.position !== "outer-space",
        )

        pushAction(
            manageStations(planet, "Core Mining Station", miningStations, capital, player.difficulty, "Medium"),
            actions,
        )

        const solarSatellites = ships.filter(
            (ship) =>
                ship.class === "Solar-Satellite Generator" &&
                ship.owner === player.id &&
                ship.position !== "outer-space",
        )

        const activeStations = [...horticulturalStations, ...miningStations].filter(
            (ship) => ship.position === "surface" && ship.active,
        )

        pushAction(
            manageSolarSatellites(planet, solarSatellites, capital, player.difficulty, activeStations.length),
            actions,
        )
    })

    return actions
}

const assignOrdersToCargoCarrier = (ship: Ship, player: BotPlayer, planets: ColonizedPlanet[]) => {
    const capital = planets.find((planet) => planet.capital)
    if (!capital) {
        throw new Error(`Failed to find capital for player ${player.id}`)
    }

    // It is assumed that the cargo ship is idle at the capital
    // The cargo ship needs to collect the maximum amount of resources from the
    // target planet, and deliver them to the capital planet.
    // Prioritizing food, minerals, fuels and then energy.
    const targetPlanets: { planet: Planet; resource: Resource; priority: ActionPriority }[] = []
    planets.forEach((planet) => {
        if (!planet.capital) {
            if (planet.type === "tropical") {
                if (planet.food > ship.capacity.cargo) {
                    targetPlanets.push({ planet, resource: "food", priority: "High" })
                }
            } else if (planet.type === "volcanic") {
                if (planet.minerals + planet.fuels > ship.capacity.cargo) {
                    targetPlanets.push({ planet, resource: "minerals", priority: "Medium" })
                }
            } else if (planet.type === "dessert") {
                if (planet.energy > ship.capacity.cargo) {
                    targetPlanets.push({ planet, resource: "energy", priority: "Low" })
                }
            }
        }
    })

    // Sort by priority
    targetPlanets.sort((a, b) => {
        const priorities: Record<ActionPriority, number> = { High: 3, Medium: 2, Low: 1 }
        return priorities[b.priority] - priorities[a.priority]
    })
    // Take the first target planet
    const target = targetPlanets[0]
    const orders: BotActionObject[] = []
    if (target) {
        // The ship should be in the docking bay, but check that it is before transferring
        if (ship.position === "docked") {
            orders.push({
                type: "ship-reposition",
                payload: { id: ship.id, destination: "orbit" },
                playerId: player.id,
                priority: "Medium",
            })
        }

        // Transfer to the target planet
        orders.push({
            type: "ship-transfer",
            payload: { id: ship.id, destination: target.planet.id },
            playerId: player.id,
            priority: "Medium",
        })

        // Dock the ship at the target planet
        orders.push({
            type: "ship-reposition",
            payload: { id: ship.id, destination: "docked" },
            playerId: player.id,
            priority: "Medium",
        })

        // Load the cargo from the target planet
        orders.push({
            type: "ship-load-cargo",
            payload: { id: ship.id, cargoType: target.resource, amount: ship.capacity.cargo },
            playerId: player.id,
            priority: "Medium",
        })

        if (target.resource === "minerals") {
            // Also try and load fuels
            orders.push({
                type: "ship-load-cargo",
                payload: { id: ship.id, cargoType: "fuels", amount: ship.capacity.cargo },
                playerId: player.id,
                priority: "Medium",
            })
        }

        // Launch the ship
        orders.push({
            type: "ship-reposition",
            payload: { id: ship.id, destination: "orbit" },
            playerId: player.id,
            priority: "Medium",
        })

        // Transfer to the capital planet
        orders.push({
            type: "ship-transfer",
            payload: { id: ship.id, destination: capital.id },
            playerId: player.id,
            priority: "Medium",
        })

        // Dock the ship at the capital planet
        orders.push({
            type: "ship-reposition",
            payload: { id: ship.id, destination: "docked" },
            playerId: player.id,
            priority: "Medium",
        })

        // Unload the cargo
        orders.push({
            type: "ship-unload-cargo",
            payload: { id: ship.id, cargoType: target.resource, amount: ship.capacity.cargo },
            playerId: player.id,
            priority: "High",
        })
    }

    return orders
}

const prepareShipOrder = (ship: Ship, player: BotPlayer): BotActionObject | undefined => {
    let action: BotActionObject | undefined
    if (ship.position === "docked") {
        if (ship.requiredCrew !== "remote" && ship.crew < ship.requiredCrew) {
            // Assign orders to the cargo carrier to crew it
            action = {
                type: "ship-crew",
                payload: { id: ship.id, crew: ship.requiredCrew },
                playerId: player.id,
                priority: "Medium",
            }
        } else if (ship.fuels !== "nuclear" && ship.fuels < ship.capacity.fuels) {
            // Assign orders to the cargo carrier to refuel
            action = {
                type: "ship-modify-fuel",
                payload: { id: ship.id, amount: ship.capacity.fuels },
                playerId: player.id,
                priority: "Medium",
            }
        }
    } else if (ship.position === "orbit") {
        // Assign orders to the cargo carrier to dock at a planet
        action = {
            type: "ship-reposition",
            payload: { id: ship.id, destination: "docked" },
            playerId: player.id,
            priority: "Medium",
        }
    }

    return action
}

export const manageCargoCarriers = (
    player: BotPlayer,
    ships: Ship[],
    planets: ColonizedPlanet[],
): BotActionObject[] => {
    const actions: BotActionObject[] = []

    // Implement cargo ship management logic here
    const cargoShips = ships.filter((ship) => ship.class === "Cargo Store / Carrier")

    if (cargoShips.length < shipLimits["Cargo Store / Carrier"][player.difficulty]) {
        actions.push({
            type: "ship-purchase",
            payload: {
                class: "Cargo Store / Carrier",
                name: undefined,
            },
            playerId: player.id,
            priority: "Low",
        })
    }

    cargoShips.forEach((ship) => {
        const prepareOrder = prepareShipOrder(ship, player)
        if (prepareOrder) {
            actions.push(prepareOrder)
        } else {
            // Assign orders to the cargo carrier
            const orders = assignOrdersToCargoCarrier(ship, player, planets)
            player.shipOrders[ship.id] = orders
            if (orders.length > 0) {
                // Reference, don't remove it as it may not be actioned
                const nextOrder = orders[0]
                nextOrder.id = `${ship.id}-${player.id}`

                // Record the orders for the ship
                player.shipOrders[ship.id] = orders
                // Push the first order to the actions
                actions.push(nextOrder)
            }
        }
    })

    return actions
}

const assignOrdersToBattleCruiser = (ship: Ship, player: BotPlayer, planets: ColonizedPlanet[]): BotActionObject[] => {
    const orders: BotActionObject[] = []

    return orders
}

export const manageBattleCruisers = (
    player: BotPlayer,
    ships: Ship[],
    planets: ColonizedPlanet[],
    otherPlanets: Planet[],
    platoons: Platoon[],
): BotActionObject[] => {
    const actions: BotActionObject[] = []

    // Implement carrier ship management logic here
    const carrierShips = ships.filter((ship) => ship.class === "B-29 Battle Cruiser")

    if (carrierShips.length < shipLimits["B-29 Battle Cruiser"][player.difficulty]) {
        actions.push({
            type: "ship-purchase",
            payload: {
                class: "B-29 Battle Cruiser",
                name: undefined,
            },
            playerId: player.id,
            priority: "Low",
        })
    }

    carrierShips.forEach((ship) => {
        const prepareOrder = prepareShipOrder(ship, player)
        if (prepareOrder) {
            actions.push(prepareOrder)
        } else {
            // Assign orders to the battle cruiser
            const orders = assignOrdersToBattleCruiser(ship, player, planets)
            player.shipOrders[ship.id] = orders
            if (orders.length > 0) {
                // Reference, don't remove it as it may not be actioned
                const nextOrder = orders[0]
                nextOrder.id = `${ship.id}-${player.id}`

                // Record the orders for the ship
                player.shipOrders[ship.id] = orders
                // Push the first order to the actions
                actions.push(nextOrder)
            }
        }
    })

    return actions
}
