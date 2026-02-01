import { ColonizedPlanet, Ship } from "../entities"

export const canCrewShip = (ship: Ship, planet: ColonizedPlanet): boolean => {
    let canCrew = false

    if (planet.owner !== ship.owner) {
        console.warn(`Ship '${ship.name}' cannot be crewed at planet '${planet.name}'`)
    } else if (ship.position !== "docked") {
        console.warn(`Ship '${ship.name}' is not docked`)
    } else if (ship.requiredCrew === "remote") {
        console.warn(`Ship '${ship.name}' does not require crew`)
    } else if (ship.crew === ship.requiredCrew) {
        console.warn(`Ship '${ship.name}' already has a full crew`)
    } else if (planet.population < ship.requiredCrew) {
        console.warn(
            `Planet '${planet.name}' does not have the required population to crew '${ship.name}' (${planet.population} of ${ship.requiredCrew})`,
        )
    } else {
        canCrew = true
    }

    return canCrew
}

export const applyCrewShip = (ship: Ship, planet: ColonizedPlanet): [ColonizedPlanet, Ship] => {
    let modifiedPlanet
    let modifiedShip

    if (planet.owner !== ship.owner) {
        throw new Error(`Planet is now owned by ship owner`)
    } else if (ship.requiredCrew === "remote") {
        throw new Error(`Ship does not require crew: ${ship.id}`)
    } else {
        modifiedPlanet = { ...planet }
        modifiedPlanet.population -= ship.requiredCrew

        modifiedShip = { ...ship }
        modifiedShip.crew += ship.requiredCrew
    }

    return [modifiedPlanet, modifiedShip] as const
}
