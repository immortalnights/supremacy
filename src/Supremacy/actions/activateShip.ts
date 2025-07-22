import { ColonizedPlanet, Ship } from "../entities"

export const canActivateShip = (ship: Ship, planet: ColonizedPlanet, active: boolean) => {
    let canActivate = false

    if (active) {
        if (ship.position !== "surface") {
            console.error(`Cannot activate ship ${ship.name} from position ${ship.position}.`)
        } else if (ship.requiredCrew !== "remote" && ship.crew !== ship.requiredCrew) {
            console.error(`Cannot activate ship ${ship.name} without full crew (${ship.crew}/${ship.requiredCrew}).`)
        } else {
            canActivate = true
        }
    } else {
        // Can always deactivate a ship
        canActivate = true
    }

    return canActivate
}

export const applyActivateShip = (ship: Ship, planet: ColonizedPlanet, active: boolean) => {
    return {
        ...ship,
        active: active,
    }
}
