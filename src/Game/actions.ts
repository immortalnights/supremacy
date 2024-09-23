import { useContext } from "react"
import { CommandContext } from "../CommandContext"
import { Planet, Ship, ShipPosition } from "./entities"

export const useMoveShip = () => {
    const { exec } = useContext(CommandContext)
    return (ship: Ship, planet: Planet, position: ShipPosition) =>
        exec("transition-ship", { ship, planet, position })
}

export function useDecommission() {
    const { exec } = useContext(CommandContext)

    return (ship: Ship) => exec("decommission-ship", { ship })
}
