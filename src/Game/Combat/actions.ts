import { useContext } from "react"
import { CommandContext } from "../CommandContext"
import { ColonizedPlanet, Platoon, Ship } from "Game/entities"

export const useModifyAggression = () => {
    const { exec } = useContext(CommandContext)
    return (planet: ColonizedPlanet, aggression: number) =>
        exec("modify-planet-aggression", { planet, aggression })
}

export const useTransferPlatoon = () => {
    const { exec } = useContext(CommandContext)

    const load = (platoon: Platoon, ship: Ship) =>
        exec("load-platoon", { platoon, ship })

    const unload = (platoon: Platoon, planet: ColonizedPlanet) =>
        exec("unload-platoon", { platoon, planet })

    return [load, unload] as const
}
