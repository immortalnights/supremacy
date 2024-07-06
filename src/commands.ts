import { useContext } from "react"
import { CommandContext } from "./CommandContext"
import { Planet } from "./Game/entities"

export function useRenamePlanet() {
    const { exec } = useContext(CommandContext)

    return (planet: Planet, name: string) => {
        exec("rename-planet", { planet: planet.id, newName: name })
    }
}
