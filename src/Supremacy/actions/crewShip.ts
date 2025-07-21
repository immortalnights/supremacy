import { nextFreeIndex } from "#Supremacy/utilities"
import { DAYS_PER_YEAR } from "../consts"
import { ColonizedPlanet, isColonizedPlanet, Planet, Ship, ShipBlueprint, ShipDocked } from "../entities"
import { Difficulty } from "../types"
import { canModifyShipAtPlanet } from "./ships"

export const canCrewShip = (player: string, ship: Ship, planet: Planet): boolean => {
    let canCrew = false

    if (canModifyShipAtPlanet(player, ship, planet)) {
        const p = planet as ColonizedPlanet

        if (ship.position !== "docked") {
            console.warn(`Ship '${ship.name}' is not docked`)
        } else if (ship.requiredCrew === "remote") {
            console.warn(`Ship '${ship.name}' does not require crew`)
        } else if (ship.crew === ship.requiredCrew) {
            console.warn(`Ship '${ship.name}' already has a full crew`)
        } else if (p.population < ship.requiredCrew) {
            console.warn(
                `Planet '${planet.name}' does not have the required population to crew '${ship.name}' (${p.population} of ${ship.requiredCrew})`,
            )
        } else {
            canCrew = true
        }
    }

    return canCrew
}

export const applyCrewShip = (player: string, ship: Ship, planet: Planet): [ColonizedPlanet, Ship] => {
    let modifiedPlanet
    let modifiedShip

    if (!isColonizedPlanet(planet)) {
        throw new Error(`Planet is not colonized: ${planet.id}`)
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
