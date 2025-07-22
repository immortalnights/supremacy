import type { ColonizedPlanet, Ship, Platoon } from "../entities"
import type { BotPlayer, BotActionObject } from "./types"

export const managePlanets = (
    player: BotPlayer,
    planets: ColonizedPlanet[],
    ships: Ship[],
    platoons: Platoon[],
): BotActionObject[] => {
    const actions: BotActionObject[] = []

    planets.forEach((planet) => {
        console.debug(
            `Planet ${planet.name} P=${planet.population}/F=${planet.food}/E+${planet.energy}/M=${planet.minerals}/Fu=${planet.fuels}`,
        )
    })

    return actions
}
