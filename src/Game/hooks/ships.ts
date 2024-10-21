import { useAtomValue } from "jotai"
import { shipsAtom } from "../store"
import type { Planet } from "../entities"
import { shipsDockedAtPlanet, shipsOnPlanetSurface } from "Game/utilities/ships"

// replace with platoonsOnPlanetAtom like function
export const useShipsInDockingBay = (planet: Planet) => {
    const ships = useAtomValue(shipsAtom)
    return shipsDockedAtPlanet(ships, planet)
}

// replace with platoonsOnPlanetAtom like function
export const useShipsOnPlanetSurface = (planet: Planet) => {
    const ships = useAtomValue(shipsAtom)
    return shipsOnPlanetSurface(ships, planet)
}
