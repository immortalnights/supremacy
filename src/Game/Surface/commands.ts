import { useContext } from "react"
import { CommandContext } from "../../CommandContext"
import { Planet, Ship, ShipPosition } from "../entities"

export const useMoveShip = () => {
    const { exec } = useContext(CommandContext)
    return (ship: Ship, planet: Planet, position: ShipPosition) =>
        exec("transition-ship", { ship, planet, position })
}

export const useEnableDisableShip = () => {
    const { exec } = useContext(CommandContext)
    return (ship: Ship, enabled: boolean) =>
        exec("toggle-ship", { ship, enabled })
}
