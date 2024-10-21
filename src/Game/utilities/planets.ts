import { ColonizedPlanet, Planet } from "Game/entities"

export const isColonizedPlanet = (planet: Planet): planet is ColonizedPlanet =>
    planet.type !== "lifeless"
