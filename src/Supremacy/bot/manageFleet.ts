import type { BotPlayer } from "../types"
import type { ColonizedPlanet, Ship, Platoon, ShipClass, Planet } from "../entities"
import { shipLimits } from "./consts"
import type { BotDifficulty, BotActionObject, ActionPriority } from "./types"
import { pushAction } from "./utils"

// Each Bot is limited to a number of ships of a specific class based on their difficulty
const getShipLimit = (cls: ShipClass, planet: ColonizedPlanet, botDifficulty: BotDifficulty) => {
    const min = Math.ceil(planet.population / 3000)
    const max = shipLimits[cls][botDifficulty]
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
                type: "toggle-ship",
                payload: {
                    id: shipToActivate.id,
                    active: true,
                },
                playerId: planet.owner,
                priority,
            }
        } else if (shipToTransition) {
            action = {
                type: "reposition-ship",
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
                    type: "crew-ship",
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
                type: "reposition-ship",
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

    const [min, max] = getShipLimit(shipClass, planet, botDifficulty)

    // If the planet doesn't have the minimum stations, and there is available inactive ones,
    if (activeShips.length < min && activeShips.length < max && inactiveShips.length > 0) {
        console.log(
            `Below minimum (${min}) threshold for active ${shipClass} on planet`,
            planet.name,
            `(${shipsAtPlanet.length}/${activeShips.length}/${min})`,
        )

        action = manageStationsAtPlanet(planet, activeShips, inactiveShips, priority)
    } else if (planet.capital) {
        // Don't transfer to the capital from other planets
        console.debug(`No ${shipClass} available for planet ${planet.name}, purchasing one`)
        action = {
            type: "purchase-ship",
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
                    type: "reposition-ship",
                    payload: {
                        id: docked[0].id,
                        destination: "orbit",
                    },
                    playerId: planet.owner,
                    priority,
                }
            } else if (inOrbit.length > 0) {
                action = {
                    type: "transfer-ship",
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
                    type: "purchase-ship",
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
    const min = Math.ceil((activeStations * 1) / 4)
    const max = shipLimits["Solar-Satellite Generator"][botDifficulty]

    // FIXME this wont handle Solars that are in orbit around the Capital, that are not intended to be moved to another planet...
    // Essentially, other planets will steal the Capital's Solars

    const shipsAtPlanet = solarSatellites.filter(
        (ship) => ship.position !== "outer-space" && ship.location.planet === planet.id,
    )

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
                type: "reposition-ship",
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
                type: "purchase-ship",
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
                        type: "transfer-ship",
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
                        type: "purchase-ship",
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

export const manageFleets = (
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

    // TODO manage Atmos?
    // TODO manage Battle Cruisers

    return actions
}
