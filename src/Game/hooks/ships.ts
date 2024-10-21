import { useAtomValue } from "jotai"
import { shipsAtom } from "../store"
import type { Planet, Ship } from "../entities"
import { shipsDockedAtPlanet, shipsOnPlanetSurface } from "Game/utilities/ships"
import { useCallback, useState } from "react"

export const useSelectedShip = () => {
    const [selectedShip, setSelectedShip] = useState<Ship["id"] | undefined>()
    const ships = useAtomValue(shipsAtom)
    let ship
    if (selectedShip) {
        ship = ships.find((item) => item.id === selectedShip)
    }

    const setShip = useCallback(
        (ship: Ship) => {
            setSelectedShip(ship.id)
        },
        [setSelectedShip],
    )

    return [ship, setShip] as const
}

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
