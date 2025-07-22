import type { BotPlayer } from "../types"
import type { ColonizedPlanet, Planet, Platoon, Ship } from "../entities"
import type { BotActionObject } from "./types"
import { manageFleets } from "./manageFleet"
import { managePlanets } from "./managePlanets"
import { managePlatoons } from "./managePlatoons"

export const processBot = (
    player: BotPlayer,
    planets: Planet[],
    ships: Ship[],
    platoons: Platoon[],
): BotActionObject | undefined => {
    const actions: BotActionObject[] = []

    console.log(planets[0].id, planets[0].type === "lifeless" ? "??" : planets[0].owner, player.id)

    const ownedPlanets = planets.filter(
        (planet): planet is ColonizedPlanet => planet.type !== "lifeless" && planet.owner === player.id,
    )
    const ownedShips = ships.filter((ship) => ship.owner === player.id)
    const ownedPlatoons = platoons.filter((platoon) => platoon.owner === player.id)

    console.debug(
        `Bot ${player.id} has ${ownedPlanets.length} planets, ${ownedShips.length} ships, and ${ownedPlatoons.length} platoons`,
    )

    // Gather all possible actions
    actions.push(...managePlanets(player, ownedPlanets, ownedShips, ownedPlatoons))
    actions.push(...manageFleets(player, ownedShips, ownedPlanets, ownedPlatoons))
    actions.push(...managePlatoons(player, ownedPlatoons, ownedPlanets, ownedShips))

    console.debug(`Bot ${player.id} (${player.difficulty}) has ${actions.length} actions to choose from`)

    let chosenAction: BotActionObject | undefined
    switch (player.difficulty) {
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

    console.debug(`Bot ${player.id} chosen action`, chosenAction)
    return chosenAction
}
