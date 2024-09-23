import { useContext } from "react"
import { CommandContext } from "../../CommandContext"
import { ColonizedPlanet, ShipBlueprint } from "../entities"

export function usePurchaseShip() {
    const { exec } = useContext(CommandContext)

    return (blueprint: ShipBlueprint, planet: ColonizedPlanet, name: string) =>
        exec("purchase-ship", { planet: planet.id, blueprint, name })
}
