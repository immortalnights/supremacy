import { useAtomValue } from "jotai"
import { shipsAtom } from "../store"
import type { Planet, Ship, ShipPosition } from "Supremacy/entities"
import { useCallback, useContext, useState } from "react"
import { CommandContext } from "Game/context/CommandContext"
import { useSetNotification } from "Game/components/Notification"

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

export const useMoveShip = () => {
    const notify = useSetNotification()
    const { exec } = useContext(CommandContext)

    const execute = (ship: Ship, position: ShipPosition) => {
        exec("transition-ship", { ship, position })
    }

    return (ship: Ship, targetPosition: ShipPosition) => {
        if (ship.class === "Atmosphere Processor") {
            console.warn("Control Atmosphere Processor from star map panel")
        } else {
            switch (targetPosition) {
                case "orbit":
                    switch (ship.position) {
                        case "orbit":
                            notify(`${ship.name} is already in orbit`)
                            break

                        case "surface":
                            notify(`Move ${ship.name} to a docking bay first`)
                            break
                        case "docked": {
                            execute(ship, targetPosition)
                            break
                        }
                        case "outer-space":
                            notify(`${ship.name} is in transit`)
                            break
                    }
                    break
                case "surface":
                    if (ship.position === "docked") {
                        execute(ship, targetPosition)
                    } else {
                        notify(`Move ${ship.name} to a docking bay first`)
                    }
                    break
                case "docked":
                    switch (ship.position) {
                        case "orbit":
                            execute(ship, targetPosition)
                            break
                        case "surface":
                            notify(`${ship.name} is already on a planet`)
                            break
                        case "docked": {
                            notify(`${ship.name} is already on a planet`)
                            break
                        }
                        case "outer-space":
                            notify(`${ship.name} is in transit`)
                            break
                    }

                    break
                case "outer-space":
                    console.error("Unexpected use of 'transition-ship' command")
                    break
            }
        }
    }
}

export const useTransferShip = () => {
    const { exec } = useContext(CommandContext)
    return (ship: Ship, planet: Planet) => exec("transfer-ship", { ship, planet })
}

export function useDecommission() {
    const { exec } = useContext(CommandContext)

    return (ship: Ship) => exec("decommission-ship", { ship })
}
