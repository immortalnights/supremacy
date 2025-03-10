import { useAtomValue } from "jotai"
import { shipsAtom } from "../store"
import type { Ship } from "../entities"
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
