import { useContext } from "react"
import { CommandContext } from "../CommandContext"
import { Platoon, SuitClass, WeaponClass } from "../entities"

export const useModifyPlatoonTroops = () => {
    const { exec } = useContext(CommandContext)
    return (platoon: Platoon, quantity: number) =>
        exec("modify-platoon-troops", { platoon, quantity })
}

export const useModifyPlatoonSuit = () => {
    const { exec } = useContext(CommandContext)
    return (platoon: Platoon, suit: SuitClass) =>
        exec("modify-platoon-suit", { platoon, suit })
}

export const useModifyPlatoonWeapon = () => {
    const { exec } = useContext(CommandContext)
    return (platoon: Platoon, weapon: WeaponClass) =>
        exec("modify-platoon-weapon", { platoon, weapon })
}

export const useEquipPlatoon = () => {
    const { exec } = useContext(CommandContext)
    return (platoon: Platoon) => exec("equip-platoon", { platoon })
}

export const useDismissPlatoon = () => {
    const { exec } = useContext(CommandContext)
    return (platoon: Platoon) => exec("dismiss-platoon", { platoon })
}

export const useTrainingActions = () => {
    const modifyTroops = useModifyPlatoonTroops()
    const modifySuit = useModifyPlatoonSuit()
    const modifyWeapon = useModifyPlatoonWeapon()
    const equip = useEquipPlatoon()
    const dismiss = useDismissPlatoon()

    return { modifyTroops, modifySuit, modifyWeapon, equip, dismiss }
}
