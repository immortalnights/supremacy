import { Planet, Ship } from "../entities"

export const canModifyShipAtPlanet = (player: string, ship: Ship, planet: Planet): boolean => {
    let ok = false
    if (planet.type === "lifeless") {
        console.error(`Planet ${planet.name} is lifeless`)
    } else if (planet.owner !== player) {
        console.error(`Planet ${planet.name} is not owned by player ${player}`)
    } else if (ship.owner !== player) {
        console.error(`Ship ${ship.name} is not owned by player ${player}`)
    } else if (ship.position === "outer-space" || ship.location.planet !== planet.id) {
        console.error(`Ship ${ship.name} is not at planet ${planet.name}`)
    } else {
        ok = true
    }
    return ok
}
