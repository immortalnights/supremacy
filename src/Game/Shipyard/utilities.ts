import { ColonizedPlanet, Ship } from "../entities"
import { shipInLocation } from "../utilities"

export const canAffordShip = (
    planet: ColonizedPlanet,
    type: string,
): boolean => {
    return true
}

export const deductShipCost = (
    planet: ColonizedPlanet,
    type: string,
): ColonizedPlanet => {
    return { ...planet }
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
            availableIndex = 1 + index
            break
        }
    }

    return availableIndex
}

export const commissionShip = (
    type: string,
    name: string,
    planet: ColonizedPlanet,
    index: number,
): Ship => {
    return {
        id: crypto.randomUUID(),
        name,
        owner: planet.owner,
        class: type,
        // requiredCrew: number
        crew: 0,
        // maxFuel: number
        fuel: 0,
        passengers: 0,
        // passengerLimit: number
        // cargoCapacity: number
        location: {
            planet: planet.id,
            position: "docked",
            index,
        },
        active: false,
        // value: number
    }
}
