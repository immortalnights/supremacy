import type { BotPlayer, BotActionObject } from "../types"
import type { ColonizedPlanet, Ship, Platoon } from "../entities"

export const managePlanets = (
    player: BotPlayer,
    planets: ColonizedPlanet[],
    ships: Ship[],
    platoons: Platoon[],
): BotActionObject[] => {
    const actions: BotActionObject[] = []

    planets.forEach((planet) => {
        console.debug(
            `Planet ${planet.name} P=${planet.population}/${planet.morale.toFixed(2)}/${planet.growth.toFixed(2)}/F=${planet.food}/E=${planet.energy}/M=${planet.minerals}/Fu=${planet.fuels}/C=${Math.floor(planet.credits)}`,
        )
    })

    return actions
}
