import type { BotPlayer } from "../types"
import type { ColonizedPlanet, Ship, Platoon } from "../entities"
import { shipLimits } from "./consts"
import type { BotDifficulty, BotActionObject } from "./types"
import { pushAction } from "./utils"

const manageHorticulturalStations = (
    botDifficulty: BotDifficulty,
    planet: ColonizedPlanet,
    horticulturalStations: Ship[],
): BotActionObject | undefined => {
    let action: BotActionObject | undefined = undefined

    const horticulturalStationAtPlanet = horticulturalStations.filter(
        (ship) => ship.position !== "outer-space" && ship.location.planet === planet.id,
    )
    const activeHorticulturalStations = horticulturalStationAtPlanet.filter(
        (ship) => ship.position === "surface" && ship.active,
    ).length
    const inactiveHorticulturalStations = horticulturalStationAtPlanet.filter(
        (ship) => ship.position !== "surface" || !ship.active,
    ).length

    console.debug(
        `Planet ${planet.name} has ${inactiveHorticulturalStations}/${activeHorticulturalStations} horticultural stations`,
    )

    // Each Bot is limited to a specific number of horticultural stations based on their difficulty
    const min = Math.ceil(planet.population / 3000)
    const max = shipLimits["Horticultural Station"][botDifficulty]
    if (activeHorticulturalStations < min && activeHorticulturalStations < max) {
        console.log(
            `Below minimum (${min}) threshold for active Horticultural Stations on planet`,
            planet.name,
            `(${horticulturalStations.length}/${activeHorticulturalStations}/${min})`,
        )

        if (inactiveHorticulturalStations > 0) {
            // Find ship to activate
            const shipToActivate = horticulturalStations.find((ship) => ship.position === "surface" && !ship.active)

            // Prepare docked ship
            const shipToCrew = horticulturalStations.find(
                (ship) => ship.position === "docked" && ship.crew !== ship.requiredCrew,
            )

            const shipToTransition = horticulturalStations.find(
                (ship) => ship.position === "docked" && ship.crew === ship.requiredCrew,
            )

            // Add the actions as applicable
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
            } else {
                console.error(
                    `Have inactive horticultural stations, but no action identified for it on planet ${planet.name}`,
                )
            }
        } else {
            // TODO check if one is available elsewhere and transfer it.
            console.debug(`No horticultural stations found for planet ${planet.name}, purchasing one`)
            action = {
                type: "purchase-ship",
                payload: {
                    id: planet.id,
                    class: "Horticultural Station",
                    name: undefined,
                },
                playerId: planet.owner,
                priority: "High",
            }
        }
    }

    return action
}

const manageMiningStations = (
    botDifficulty: BotDifficulty,
    planet: ColonizedPlanet,
    miningStations: Ship[],
): BotActionObject[] => {
    let actions: BotActionObject[] = []
    // maxMiningStationsForBot
    return actions
}

const manageSolarSatellites = (
    playerId: string,
    planet: ColonizedPlanet,
    solarSatellites: Ship[],
    activeShips: Ship[],
): BotActionObject[] => {
    let actions: BotActionObject[] = []
    return actions
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
            (ship) => ship.class === "Horticultural Station" && ship.owner === player.id,
        )

        pushAction(manageHorticulturalStations(player.difficulty, planet, horticulturalStations), actions)

        const miningStations = ships.filter((ship) => ship.class === "Core Mining Station" && ship.owner === player.id)

        actions.push(...manageMiningStations(player.difficulty, planet, miningStations))

        const solarSatellites = ships.filter(
            (ship) => ship.class === "Solar-Satellite Generator" && ship.owner === player.id,
        )

        actions.push(
            ...manageSolarSatellites(player.id, planet, solarSatellites, [...horticulturalStations, ...miningStations]),
        )
    })

    // TODO manage Atmos?
    // TODO manage Battle Cruisers

    return actions
}
