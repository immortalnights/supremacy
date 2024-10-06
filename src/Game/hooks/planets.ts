import { useAtomValue } from "jotai"
import { planetsAtom, selectedPlanetAtom, sessionAtom } from "../store"
import type { ColonizedPlanet, Planet } from "../entities"
import { throwError } from "game-signaling-server/client"

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

    return capital && isColonizedPlanet(capital)
        ? capital
        : throwError("Failed to find capital planet")
}
