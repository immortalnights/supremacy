import { ColonizedPlanet, Ship } from "../entities"

export const canAffordShip = (planet: ColonizedPlanet, type: string) => {
    return true
}

export const deductShipCost = (planet: ColonizedPlanet, type: string) => {
    return { ...planet }
}

export const commissionShip = (
    type: string,
    name: string,
    owner: string,
): Ship => {
    return {
        id: crypto.randomUUID(),
        name,
        owner,
        class: type,
        // requiredCrew: number
        // crew: number
        // maxFuel: number
        // fuel: number
        // passengers: number
        // passengerLimit: number
        // cargoCapacity: number
        // location: {
        //     planet?: Planet["id"]
        //     position: "landed" | "docked" | "orbit" | "outer-space"
        //     // Bay or Planet Surface numeric location
        //     index?: number
        // }
        // active: boolean
        // value: number
    }
}
