import { useContext } from "react"
import { CommandContext } from "../../context/CommandContext"
import { Ship } from "Supremacy/entities"

export const useEnableDisableShip = () => {
    const { exec } = useContext(CommandContext)
    return (ship: Ship, enabled: boolean) => exec("toggle-ship", { ship, enabled })
}
