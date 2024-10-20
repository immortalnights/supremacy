import { useContext } from "react"
import { CommandContext } from "../CommandContext"
import { ColonizedPlanet } from "Game/entities"

export const useModifyAggression = () => {
    const { exec } = useContext(CommandContext)
    return (planet: ColonizedPlanet, aggression: number) =>
        exec("modify-planet-aggression", { planet, aggression })
}
