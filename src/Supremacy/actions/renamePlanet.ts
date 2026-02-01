import { ColonizedPlanet, Planet } from "../entities"

export const canRenamePlanet = (player: string, planet: Planet, newName: string): boolean => {
    let valid = false

    if (planet.type === "lifeless") {
        console.warn(`Cannot rename lifeless planet ${planet.id}`)
    } else if (planet.owner !== player) {
        console.warn(`Cannot rename planet ${planet.id} owned by ${planet.owner}`)
    } else if (!newName || newName.trim() === "") {
        console.warn(`Cannot rename planet ${planet.id} to an empty name`)
    } else {
        valid = true
    }

    return valid
}

export const applyRenamePlanet = (planet: ColonizedPlanet, newName: string): Planet => {
    return { ...planet, name: newName }
}
