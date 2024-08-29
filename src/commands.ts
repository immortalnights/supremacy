import { useContext } from "react"
import { CommandContext } from "./CommandContext"
import {
    CargoType,
    ColonizedPlanet,
    Planet,
    Ship,
    ShipBlueprint,
} from "./Game/entities"
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

    return (blueprint: ShipBlueprint, planet: ColonizedPlanet, name: string) =>
        exec("purchase-ship", { planet: planet.id, blueprint, name })
}

export function useCrewShip() {
    const { exec } = useContext(CommandContext)

    return (ship: Ship) => exec("crew-ship", { ship })
}
export function useUnloadShip() {
    const { exec } = useContext(CommandContext)

    return (ship: Ship) => exec("unload-ship", { ship })
}
export function useDecommission() {
    const { exec } = useContext(CommandContext)

    return (ship: Ship) => exec("decommission-ship", { ship })
}
export function useLoadPassengers() {
    const { exec } = useContext(CommandContext)

    const load = (ship: Ship, quantity: number) =>
        exec("load-passengers", { ship, quantity })

    const unload = (ship: Ship, quantity: number) =>
        exec("unload-passengers", { ship, quantity })

    return [load, unload]
}

export function useLoadFuel() {
    const { exec } = useContext(CommandContext)

    const load = (ship: Ship, quantity: number) =>
        exec("load-fuel", { ship, quantity })

    const unload = (ship: Ship, quantity: number) =>
        exec("unload-fuel", { ship, quantity })

    return [load, unload]
}

export function useLoadCargo() {
    const { exec } = useContext(CommandContext)

    const load = (ship: Ship, cargo: CargoType, quantity: number) =>
        exec("load-cargo", { ship, cargo, quantity })

    const unload = (ship: Ship, cargo: CargoType, quantity: number) =>
        exec("unload-cargo", { ship, cargo, quantity })

    return [load, unload]
}
