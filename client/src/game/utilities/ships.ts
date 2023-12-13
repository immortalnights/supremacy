import type { IPlanet, IShip, IResources } from "@server/simulation/types"

export const hasCargo = (ship: IShip, type: string) => {
    return ship.cargo[type as keyof IResources] > 0
}

export const hasResource = (planet: IPlanet, type: string) => {
    return planet.resources[type as keyof IResources] > 0
}

export const isCargoFull = (ship: IShip) => {
    const total = totalCargo(ship.cargo)
    return ship.capacity != null && total === ship.capacity.cargo
}

export const totalCargo = (resources: IResources) => {
    return Object.keys(resources).reduce((prev, value) => {
        const key = value as keyof IResources
        return prev + resources[key]
    }, 0)
}
