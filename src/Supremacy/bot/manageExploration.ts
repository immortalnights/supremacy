import type { ColonizedPlanet, LifelessPlanet, Planet, Ship } from "../entities"
import type { BotPlayer } from "../types"
import { DAYS_PER_YEAR } from "../consts"
import { BotActionObject, BotDifficulty } from "./types"

const findTerraformTarget = (
    ownedPlanets: ColonizedPlanet[],
    planets: Planet[],
    difficulty: BotDifficulty,
): LifelessPlanet | undefined => {
    let target: LifelessPlanet | undefined
    const available = planets.filter<LifelessPlanet>((planet) => planet.type === "lifeless")

    if (available.length > 0) {
        // Find the highest index for owned planets
        const maxPlanet = ownedPlanets.reduce<ColonizedPlanet | undefined>(
            (max, planet) => (max === undefined || planet.gridIndex > max.gridIndex ? planet : max),
            undefined,
        )

        if (!maxPlanet) {
            throw new Error("Failed to find owned planet as Atmos target baseline")
        }

        // Higher difficulty skips planets (mainly because there is no value claiming all the planets)
        let skip = 0
        switch (difficulty) {
            case "Normal": {
                skip = 2
                break
            }
            case "Hard":
            case "Elite": {
                skip = 4
                break
            }
        }

        const minRequiredIndex = maxPlanet?.gridIndex + skip
        // Identify prime candidates (planets at or above the target index)
        const candidates = available.filter((p) => p.gridIndex >= minRequiredIndex)
        if (candidates.length > 0) {
            // Use the candidate with the smallest gridIndex
            target = candidates.reduce((min, p) => (p.gridIndex < min.gridIndex ? p : min))
        } else {
            // Use the available planet with the highest gridIndex
            target = available.reduce((max, p) => (p.gridIndex > max.gridIndex ? p : max))
        }
    }

    return target
}

const manageAtmosphereProcessor = (
    player: BotPlayer,
    ship: Ship,
    planets: ColonizedPlanet[],
    otherPlanets: Planet[],
): BotActionObject | undefined => {
    let action: BotActionObject | undefined
    if (ship.position === "outer-space") {
        // Traveling to terraform target
    } else if (ship.position === "surface" && ship.active) {
        // Atmos is terraforming a planet.
    } else {
        // The atmos does not need to be transferred manually and can "launch" from any location, automatically
        const target = findTerraformTarget(planets, otherPlanets, player.difficulty)

        if (target) {
            action = {
                type: "planet-terraform",
                payload: {
                    id: target.id,
                },
                playerId: player.id,
                priority: "Medium",
            }
        }
    }

    return action
}

export const manageExploration = (
    player: BotPlayer,
    planets: ColonizedPlanet[],
    otherPlanets: Planet[],
    ships: Ship[],
    date: number,
): BotActionObject | undefined => {
    let action: BotActionObject | undefined
    if (date > DAYS_PER_YEAR) {
        const atmos = ships.find((ship) => ship.class === "Atmosphere Processor")
        if (atmos) {
            action = manageAtmosphereProcessor(player, atmos, planets, otherPlanets)
        } else {
            action = {
                type: "ship-purchase",
                payload: {
                    class: "Atmosphere Processor",
                    name: undefined,
                },
                playerId: player.id,
                priority: "Medium",
            }
        }
    }

    return action
}
