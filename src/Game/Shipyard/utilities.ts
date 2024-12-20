import { cargoTypes, ColonizedPlanet, Ship, ShipBlueprint } from "../entities"
import { Difficulty } from "../types"

export const canAffordShip = (
    planet: ColonizedPlanet,
    cost: ShipBlueprint["cost"],
    difficulty: Difficulty,
): boolean => {
    return planet.credits >= cost.credits
}

//* Assumes both planet are mutable */
export const deductShipCost = (
    planet: ColonizedPlanet,
    cost: ShipBlueprint["cost"],
    difficulty: Difficulty,
): ColonizedPlanet => {
    planet.credits -= cost.credits

    return planet
}

export const getShipCurrentCargoAmount = (ship: Ship) =>
    Object.entries(ship.cargo).reduce(
        (prevValue, [_cargo, quantity]) => prevValue + quantity,
        0,
    )

//* Assumes both ship and planet are mutable */
export const unloadCargo = (ship: Ship, planet: ColonizedPlanet) => {
    for (const cargo of cargoTypes) {
        planet[cargo] += ship.cargo[cargo]
        ship.cargo[cargo] = 0
    }
}
