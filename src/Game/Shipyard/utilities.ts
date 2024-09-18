import { cargoTypes, ColonizedPlanet, Ship, ShipBlueprint } from "../entities"
import { Difficulty } from "../types"
import { shipInLocation } from "../utilities"

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

/**
 * @param ships
 * @param maxIndex
 * @returns -1 or 1, 2, 3
 */
export const nextFreeIndex = (ships: Ship[], maxIndex: number): number => {
    let availableIndex = -1
    for (let index = 0; index < maxIndex; index++) {
        const ship = shipInLocation(ships, index)
        if (!ship) {
            availableIndex = index
            break
        }
    }

    return availableIndex
}
