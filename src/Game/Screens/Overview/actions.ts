import { useContext } from "react"
import { CommandContext } from "../../context/CommandContext"
import { ColonizedPlanet, Planet } from "Supremacy/entities"
import { clamp } from "Supremacy/utilities"

export function useRenamePlanet() {
    const { exec } = useContext(CommandContext)

    return (planet: Planet, name: string) => {
        exec("rename-planet", { planet: planet.id, newName: name })
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
