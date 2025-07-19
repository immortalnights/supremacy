import { useContext } from "react"
import { CommandContext } from "../../context/CommandContext"
import { ColonizedPlanet, Planet } from "Supremacy/entities"
import { clamp } from "Supremacy/utilities"
import { canRenamePlanet } from "#Supremacy/actions/planet"
import { useSession } from "Game/hooks/session"

export function useRenamePlanet() {
    const { exec } = useContext(CommandContext)
    const { localPlayer } = useSession()

    return (planet: Planet, name: string) => {
        if (canRenamePlanet(localPlayer, planet, name)) {
            exec("rename-planet", { id: planet.id, newName: name })
        } else {
            console.warn("Cannot rename planet", planet.id, "to", name)
        }
    }
}

export function useAdjustTax() {
    const { exec } = useContext(CommandContext)

    return (planet: ColonizedPlanet, change: number) => {
        const newTax = clamp(planet.tax + change, 0, 100)
        exec("set-planet-tax", { planet: planet.id, newTax })
    }
}

export function useTransferCredits() {
    const { exec } = useContext(CommandContext)

    return () => {
        exec("transfer-planet-credits", {})
    }
}
