import { ColonizedPlanet, Planet } from "Game/entities"

export const getPlayerCapital = (planets: Planet[], player: string) => {
    const index = planets.findIndex(
        (p) => isColonizedPlanet(p) && p.capital && p.owner === player,
    )

    if (index === -1) {
        throw new Error(`Failed to find capital planet for player ${player}`)
    }

    return [index, planets[index] as ColonizedPlanet] as const
}

export const getColonizedPlanet = (planets: Planet[], planetOrId: Planet | string) => {
    const id = typeof planetOrId === "string" ? planetOrId : planetOrId.id
    return planets.find(
        (p): p is ColonizedPlanet => p.id === id && isColonizedPlanet(p),
    )
}

export const isColonizedPlanet = (planet: Planet): planet is ColonizedPlanet =>
    planet.type !== "lifeless"
