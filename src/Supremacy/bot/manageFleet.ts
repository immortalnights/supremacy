import type { BotPlayer } from "../types"
import type { ColonizedPlanet, Ship, Platoon, ShipClass } from "../entities"
import { shipLimits } from "./consts"
import type { BotDifficulty, BotActionObject } from "./types"
import { pushAction } from "./utils"

const manageStationsAtPlanet = (
    planet: ColonizedPlanet,
    activeShips: Ship[],
    inactiveShips: Ship[],
): BotActionObject | undefined => {
    let action: BotActionObject | undefined = undefined

    console.debug(`Planet ${planet.name} has ${activeShips}/${inactiveShips} stations`)

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
                priority: "High",
            }
        } else if (shipToTransition) {
            action = {
                type: "reposition-ship",
                payload: {
                    id: shipToTransition.id,
                    destination: "surface",
                },
                playerId: planet.owner,
                priority: "High",
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
                    priority: "High",
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
                priority: "High",
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
    [min, max]: [number, number],
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

    // If the planet doesn't have the minimum stations, and there is availble inactive ones,
    if (activeShips.length < min && activeShips.length < max && inactiveShips.length > 0) {
        console.log(
            `Below minimum (${min}) threshold for active ${shipClass} on planet`,
            planet.name,
            `(${shipsAtPlanet.length}/${activeShips.length}/${min})`,
        )

        action = manageStationsAtPlanet(planet, activeShips, inactiveShips)
    } else {
        const inbound = stations.filter((ship) => ship.position === "outer-space" && ship.heading.to === planet.id)

        if (inbound) {
            // Do nothing for this planet until it arrives
        } else {
            // Is there one available to transfer, docked or in orbit at another planet. It might actually be "assigned" to another planet, but that is not handled at this time.
            const { docked, inOrbit } = shipsAtPlanet.reduce<{
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
                    priority: "High",
                }
            } else if (inOrbit.length > 0) {
                console.error("transfer-ship not yet implemented")
                // action = {
                //     type: "transfer-ship",
                //     payload: {
                //         id: docked[0].id,
                //         planetId: planet.id,
                //     },
                //     playerId: planet.owner,
                //     priority: "High",
                // }
            } else {
                // This planet has no available stations, check if one is inbound, or can be transferred and finally try to purchase one.
                console.debug(`No ${shipClass} available for planet ${planet.name}, purchasing one`)
                action = {
                    type: "purchase-ship",
                    payload: {
                        id: planet.id,
                        class: shipClass,
                        name: undefined,
                    },
                    playerId: planet.owner,
                    priority: "High",
                }
            }
        }
    }
    return action
}

const manageHorticulturalStations = (
    botDifficulty: BotDifficulty,
    planet: ColonizedPlanet,
    horticulturalStations: Ship[],
): BotActionObject | undefined => {
    // Each Bot is limited to a specific number of horticultural stations based on their difficulty
    const min = Math.ceil(planet.population / 3000)
    const max = shipLimits["Horticultural Station"][botDifficulty]

    return manageStations(planet, "Horticultural Station", horticulturalStations, [min, max])
}

const manageMiningStations = (
    botDifficulty: BotDifficulty,
    planet: ColonizedPlanet,
    miningStations: Ship[],
): BotActionObject | undefined => {
    const min = 0
    const max = shipLimits["Core Mining Station"][botDifficulty]

    return manageStations(planet, "Core Mining Station", miningStations, [min, max])
}

const manageSolarSatellites = (
    botDifficulty: BotDifficulty,
    planet: ColonizedPlanet,
    solarSatellites: Ship[],
    activeShips: number,
): BotActionObject | undefined => {
    let action: BotActionObject | undefined
    const min = (activeShips * 1) / 4
    const max = shipLimits["Solar-Satellite Generator"][botDifficulty]

    return action
}

export const manageFleets = (
    player: BotPlayer,
    ships: Ship[],
    planets: ColonizedPlanet[],
    platoons: Platoon[],
): BotActionObject[] => {
    const actions: BotActionObject[] = []

    // Planet functional ships are managed per-planet
    planets.forEach((planet) => {
        const horticulturalStations = ships.filter(
            (ship) =>
                ship.class === "Horticultural Station" && ship.owner === player.id && ship.position !== "outer-space",
        )

        pushAction(manageHorticulturalStations(player.difficulty, planet, horticulturalStations), actions)

        const miningStations = ships.filter(
            (ship) =>
                ship.class === "Core Mining Station" && ship.owner === player.id && ship.position !== "outer-space",
        )

        pushAction(manageMiningStations(player.difficulty, planet, miningStations), actions)

        const solarSatellites = ships.filter(
            (ship) =>
                ship.class === "Solar-Satellite Generator" &&
                ship.owner === player.id &&
                ship.position !== "outer-space",
        )

        const activeStations = [...horticulturalStations, ...miningStations].filter(
            (ship) => ship.position === "surface" && ship.active,
        )

        pushAction(manageSolarSatellites(player.difficulty, planet, solarSatellites, activeStations.length), actions)
    })

    // TODO manage Atmos?
    // TODO manage Battle Cruisers

    return actions
}
