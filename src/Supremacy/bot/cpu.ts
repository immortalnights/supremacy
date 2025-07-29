import type { BotPlayer, GameState } from "../types"
import type { ColonizedPlanet, Planet, Platoon, Ship } from "../entities"
import type { BotActionObject } from "./types"
import { manageFleets } from "./manageFleet"
import { managePlanets } from "./managePlanets"
import { managePlatoons } from "./managePlatoons"
import { manageExploration } from "./manageExploration"
import { pushAction } from "./utils"

export const calculateBot = (
    player: BotPlayer,
    { date, planets, ships, platoons }: GameState,
): BotActionObject | undefined => {
    const actions: BotActionObject[] = []

    const { ownedPlanets, otherPlanets } = planets.reduce<{
        ownedPlanets: ColonizedPlanet[]
        otherPlanets: Planet[]
    }>(
        (acc, planet) => {
            if (planet.type !== "lifeless" && planet.owner === player.id) {
                acc.ownedPlanets.push(planet)
            } else {
                acc.otherPlanets.push(planet)
            }

            return acc
        },
        { ownedPlanets: [], otherPlanets: [] },
    )
    const ownedShips = ships.filter((ship) => ship.owner === player.id)
    const ownedPlatoons = platoons.filter((platoon) => platoon.owner === player.id)
    const activePlatoons = ownedPlatoons.filter((platoon) => platoon.state === "equipped")

    console.debug(
        `Bot ${player.id} has ${ownedPlanets.length} planets, ${ownedShips.length} ships, and ${activePlatoons.length} (active) platoons`,
    )

    // Gather all possible actions
    actions.push(...managePlanets(player, ownedPlanets, ownedShips, activePlatoons))
    actions.push(...manageFleets(player, ownedShips, ownedPlanets, otherPlanets, activePlatoons))
    actions.push(...managePlatoons(player, ownedPlatoons, ownedPlanets, ownedShips))
    pushAction(manageExploration(player, ownedPlanets, otherPlanets, ownedShips, date), actions)

    // console.debug(`Bot ${player.id} (${player.difficulty}) has ${actions.length} actions to choose from`)

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

    // console.debug(`Bot ${player.id} chosen action`, chosenAction)
    return chosenAction
}
