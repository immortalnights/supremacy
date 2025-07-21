import { ActionObject } from "./actions"
import type { ColonizedPlanet, Planet, Platoon, Ship } from "./entities"
import type { AIDifficulty } from "./types"

type AIActionObject = ActionObject & {
    priority: "High" | "Medium" | "Low"
}

const manageHorticulturalStations = (
    planet: ColonizedPlanet,
    horticulturalStations: Ship[],
): AIActionObject | undefined => {
    let action: AIActionObject | undefined = undefined

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
    }

    return action
}

const maxHorticulturalStationForAI: Record<AIDifficulty, number> = {
    Easy: 2,
    Normal: 2,
    Hard: 3,
    Elite: 4,
}

/** */
const planetManager = (
    aiDifficulty: AIDifficulty,
    planets: ColonizedPlanet[],
    ships: Ship[],
    platoons: Platoon[],
): AIActionObject[] => {
    const actions: AIActionObject[] = []

    planets.forEach((planet) => {
        console.debug(`Planet ${planet.growth}`)
        const horticulturalStations = ships.filter(
            (ship) =>
                ship.class === "Horticultural Station" &&
                ship.position !== "outer-space" &&
                ship.location.planet === planet.id,
        )

        const activeHorticulturalStations = horticulturalStations.filter(
            (ship) => ship.position === "surface" && ship.active,
        ).length
        const inactiveHorticulturalStations = horticulturalStations.filter(
            (ship) => ship.position !== "surface" || !ship.active,
        ).length

        // Each AI is limited to a specific number of horticultural stations based on their difficulty
        const min = Math.ceil(planet.population / 3000)
        const max = maxHorticulturalStationForAI[aiDifficulty]
        if (activeHorticulturalStations < min && activeHorticulturalStations < max) {
            console.log(
                "Below minimum threshold for active Horticultural Stations on planet",
                planet.name,
                `(${horticulturalStations.length}/${activeHorticulturalStations}/${min})`,
            )

            if (inactiveHorticulturalStations > 0) {
                const action = manageHorticulturalStations(planet, horticulturalStations)
                if (action) {
                    actions.push(action)
                }
            } else {
                console.debug(`No horticultural stations found for planet ${planet.name}, purchasing one`)
                actions.push({
                    type: "purchase-ship",
                    payload: {
                        id: planet.id,
                        class: "Horticultural Station",
                        name: undefined,
                    },
                    playerId: planet.owner,
                    priority: "High",
                })
            }
        }
    })

    return actions
}

const fleetManager = (ships: Ship[], planets: ColonizedPlanet[], platoons: Platoon[]): AIActionObject[] => {
    const actions: AIActionObject[] = []

    return actions
}

const platoonManager = (platoons: Platoon[], planets: ColonizedPlanet[], ships: Ship[]): AIActionObject[] => {
    const actions: AIActionObject[] = []

    return actions
}

export const processAI = (
    ai: {
        id: string
        difficulty: AIDifficulty
    },
    planets: Planet[],
    ships: Ship[],
    platoons: Platoon[],
): AIActionObject | undefined => {
    const actions: AIActionObject[] = []

    console.log(planets[0].id, planets[0].type === "lifeless" ? "??" : planets[0].owner, ai.id)

    const ownedPlanets = planets.filter(
        (planet): planet is ColonizedPlanet => planet.type !== "lifeless" && planet.owner === ai.id,
    )
    const ownedShips = ships.filter((ship) => ship.owner === ai.id)
    const ownedPlatoons = platoons.filter((platoon) => platoon.owner === ai.id)

    console.debug(
        `AI ${ai.id} has ${ownedPlanets.length} planets, ${ownedShips.length} ships, and ${ownedPlatoons.length} platoons`,
    )

    // Gather all possible actions
    actions.push(...planetManager(ai.difficulty, ownedPlanets, ownedShips, ownedPlatoons))
    actions.push(...fleetManager(ownedShips, ownedPlanets, ownedPlatoons))
    actions.push(...platoonManager(ownedPlatoons, ownedPlanets, ownedShips))

    console.debug(`AI ${ai.id} (${ai.difficulty}) has ${actions.length} actions to choose from`)

    let chosenAction: AIActionObject | undefined
    switch (ai.difficulty) {
        case "Easy":
            if (actions.length > 0) {
                chosenAction = actions[Math.floor(Math.random() * actions.length)]
            }
            break
        case "Normal": {
            const priorityActions = actions.filter((act) => act.priority !== "Low")
            if (priorityActions.length > 0) {
                chosenAction = priorityActions[Math.floor(Math.random() * priorityActions.length)]
            } else if (actions.length > 0) {
                chosenAction = actions[Math.floor(Math.random() * actions.length)]
            }
            break
        }
        case "Hard":
        case "Elite": {
            // Only perform high priority actions, when available
            const priorityActions = actions.filter((act) => act.priority === "High")
            if (priorityActions.length > 0) {
                chosenAction = priorityActions[Math.floor(Math.random() * priorityActions.length)]
            } else if (actions.length > 0) {
                chosenAction = actions[Math.floor(Math.random() * actions.length)]
            }
            break
        }
    }

    console.debug(`AI ${ai.id} chosen action`, chosenAction)
    return chosenAction
}
