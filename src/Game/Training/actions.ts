import { useContext } from "react"
import { CommandContext } from "../../CommandContext"
import { Platoon } from "../entities"

export const useModifyPlatoonTroops = () => {
    const { exec } = useContext(CommandContext)
    return (platoon: Platoon, quantity: number) =>
        exec("modify-platoon-troops", { platoon, quantity })
}

export const useEquipPlatoon = () => {
    const { exec } = useContext(CommandContext)
    return (platoon: Platoon) => exec("equip-platoon", { platoon })
}

export const useDismissPlatoon = () => {
    const { exec } = useContext(CommandContext)
    return (platoon: Platoon) => exec("dismiss-platoon", { platoon })
}
