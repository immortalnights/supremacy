import { useContext } from "react"
import { CommandContext } from "../../CommandContext"
import { Ship } from "../entities"

export const useEnableDisableShip = () => {
    const { exec } = useContext(CommandContext)
    return (ship: Ship, enabled: boolean) =>
        exec("toggle-ship", { ship, enabled })
}
