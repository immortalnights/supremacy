import { useAtomValue } from "jotai"
import { shipsAtom } from "./store"
import { shipsDockedAtPlanet, shipsOnPlanetSurface } from "./utilities"
import type { Planet } from "./entities"

export const useShipsInDockingBay = (planet: Planet) => {
    const ships = useAtomValue(shipsAtom)
    return shipsDockedAtPlanet(ships, planet)
}

export const useShipsOnPlanetSurface = (planet: Planet) => {
    const ships = useAtomValue(shipsAtom)
    return shipsOnPlanetSurface(ships, planet)
}
