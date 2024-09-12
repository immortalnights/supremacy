import { useAtomValue } from "jotai"
import {
    planetsAtom,
    selectedPlanetAtom,
    sessionAtom,
    shipsAtom,
} from "./store"
import { shipsDockedAtPlanet, shipsOnPlanetSurface } from "./utilities"
import type { ColonizedPlanet, Planet } from "./entities"

const isColonizedPlanet = (planet: Planet): planet is ColonizedPlanet =>
    planet.type !== "lifeless"

export const useSelectedPlanet = () => {
    const planet = useAtomValue(selectedPlanetAtom)
    return planet
}

export const useSelectedColonizedPlanet = () => {
    const planet = useSelectedPlanet()
    return planet && isColonizedPlanet(planet) ? planet : undefined
}

export const useCapitalPlanet = () => {
    const { localPlayer } = useAtomValue(sessionAtom)
    const planets = useAtomValue(planetsAtom)

    const capital = planets.find(
        (planet) =>
            isColonizedPlanet(planet) &&
            planet.capital &&
            planet.owner === localPlayer,
    )

    return capital && isColonizedPlanet(capital) ? capital : undefined
}

export const useShipsInDockingBay = (planet: Planet) => {
    const ships = useAtomValue(shipsAtom)
    return shipsDockedAtPlanet(ships, planet)
}

export const useShipsOnPlanetSurface = (planet: Planet) => {
    const ships = useAtomValue(shipsAtom)
    return shipsOnPlanetSurface(ships, planet)
}