import { useContext } from "react"
import { CommandContext } from "../CommandContext"
import { CargoType, Ship } from "../entities"

export function useCrewShip() {
    const { exec } = useContext(CommandContext)

    return (ship: Ship) => exec("crew-ship", { ship })
}

export function useUnloadShip() {
    const { exec } = useContext(CommandContext)

    return (ship: Ship) => exec("unload-ship", { ship })
}

export function useLoadPassengers() {
    const { exec } = useContext(CommandContext)

    const load = (ship: Ship, quantity: number) =>
        exec("modify-passengers", { ship, quantity })

    const unload = (ship: Ship, quantity: number) =>
        exec("modify-passengers", { ship, quantity })

    return [load, unload]
}

export function useLoadFuel() {
    const { exec } = useContext(CommandContext)

    const load = (ship: Ship, quantity: number) =>
        exec("modify-fuel", { ship, quantity })

    const unload = (ship: Ship, quantity: number) =>
        exec("modify-fuel", { ship, quantity })

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
