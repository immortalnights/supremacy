import { Planet } from "../entities"

export function canRenamePlanet(player: string, planet: Planet, newName: string): boolean {
    return planet.type !== "lifeless" && planet.owner === player && !!newName
}

export function applyRenamePlanet(planets: Planet[], id: string, newName: string): Planet[] {
    const cpy = [...planets]
    const index = cpy.findIndex((p) => p.id === id)
    if (index !== -1) {
        const planet = cpy[index]
        cpy[index] = { ...planet, name: newName }
    }
    return cpy
}
