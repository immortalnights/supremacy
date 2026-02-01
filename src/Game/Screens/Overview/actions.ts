import { useContext } from "react"
import { CommandContext } from "../../context/CommandContext"
import { ColonizedPlanet, Planet } from "Supremacy/entities"
import { clamp } from "Supremacy/utilities"
import { canRenamePlanet } from "#Supremacy/actions/renamePlanet"
import { useSession } from "Game/hooks/session"

export function useRenamePlanet() {
    const { exec } = useContext(CommandContext)
    const { localPlayer } = useSession()

    return (planet: Planet, name: string) => {
        if (canRenamePlanet(localPlayer, planet, name)) {
            exec("planet-rename", { id: planet.id, name: name })
        } else {
            console.warn("Cannot rename planet", planet.id, "to", name)
        }
    }
}

export function useAdjustTax() {
    const { exec } = useContext(CommandContext)

    return (planet: ColonizedPlanet, change: number) => {
        const newTax = clamp(planet.tax + change, 0, 100)
        exec("planet-set-tax", { id: planet.id, tax: newTax })
    }
}

export function useTransferCredits() {
    const { exec } = useContext(CommandContext)

    return () => {
        exec("planet-transfer-credits", {})
    }
}
