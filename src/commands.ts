import { useContext } from "react"
import { CommandContext } from "./CommandContext"
import { ColonizedPlanet, Planet } from "./Game/entities"
import { clamp } from "./Game/utilities"

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

export function usePurchaseShip() {
    const { exec } = useContext(CommandContext)

    return (shipType: string, planet: ColonizedPlanet, name: string) => {
        exec("purchase-ship", { planet: planet.id, type: shipType, name })
    }
}
