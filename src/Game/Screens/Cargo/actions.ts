import { useContext } from "react"
import { CommandContext } from "../../context/CommandContext"
import { Resource, Ship } from "Supremacy/entities"

export function useCrewShip() {
    const { exec } = useContext(CommandContext)

    return (ship: Ship) => exec("ship-crew", { ship })
}

export function useUnloadShip() {
    const { exec } = useContext(CommandContext)

    return (ship: Ship) => exec("ship-unload-cargo", { ship })
}

export function useLoadPassengers() {
    const { exec } = useContext(CommandContext)

    const load = (ship: Ship, quantity: number) => exec("ship-modify-passengers", { ship, quantity })

    const unload = (ship: Ship, quantity: number) => exec("ship-modify-passengers", { ship, quantity })

    return [load, unload]
}

export function useLoadFuel() {
    const { exec } = useContext(CommandContext)

    const load = (ship: Ship, quantity: number) => exec("ship-modify-fuel", { ship, quantity })

    const unload = (ship: Ship, quantity: number) => exec("ship-modify-fuel", { ship, quantity })

    return [load, unload]
}

export function useLoadCargo() {
    const { exec } = useContext(CommandContext)

    const load = (ship: Ship, cargo: Resource, quantity: number) => exec("ship-load-cargo", { ship, cargo, quantity })

    const unload = (ship: Ship, cargo: Resource, quantity: number) =>
        exec("ship-unload-cargo", { ship, cargo, quantity })

    return [load, unload]
}
