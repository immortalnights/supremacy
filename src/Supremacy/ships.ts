import { DAYS_PER_YEAR, PLANET_POPULATION_LIMIT, TRAVEL_TIME_MULTIPLIER } from "./consts"
import {
    Planet,
    Ship,
    ColonizedPlanet,
    ShipBlueprint,
    Resource,
    ShipPosition,
    type ShipInOrbit,
    resourceTypes,
    type ShipDocked,
    type ShipInOuterSpace,
    ShipOnSurface,
    isDocketAtPlanet,
    isOnPlanetSurface,
    isColonizedPlanet,
    isAtmos,
    Atmos,
} from "./entities"
import { Difficulty } from "./types"
import { getPlayerCapital } from "./planets"
import { clone, nextFreeIndex, throwError } from "./utilities"
import { canModifyShipAtPlanet } from "./actions/ships"

export const transitionMatrix: { [key in ShipPosition]: ShipPosition[] } = {
    // From : To
    orbit: ["docked", "outer-space"],
    surface: ["docked"],
    docked: ["surface", "orbit"],
    "outer-space": ["orbit"],
}

export const getShipCurrentCargoAmount = (ship: Ship) =>
    Object.entries(ship.cargo).reduce((prevValue, [_cargo, quantity]) => prevValue + quantity, 0)

//* Assumes both ship and planet are mutable */
export const unloadCargo = (ship: Ship, planet: ColonizedPlanet) => {
    for (const cargo of resourceTypes) {
        planet[cargo] += ship.cargo[cargo]
        ship.cargo[cargo] = 0
    }
}

const findShip = (ship: Ship, ships: Ship[]) => {
    const shipIndex = ships.findIndex((s) => s.id === ship.id)
    if (shipIndex === -1) {
        throw new Error(`Invalid ship (${shipIndex}) index`)
    }

    return [shipIndex, ships[shipIndex]] as const
}

// FIXME
const getShipPlanet = (planets: Planet[], ship: Ship) => {
    const planet: ColonizedPlanet | undefined = planets
        .filter(isColonizedPlanet)
        .find((p) => (ship.position === "docked" || ship.position === "surface") && p.id === ship.location.planet)

    if (!planet) {
        console.error(`Ship ${ship.name} is not docked at a planet`)
    }

    return planet
}

/**
 * Unload all cargo
 */
export const unloadShipCargo = (player: string, planets: Planet[], ships: Ship[], ship: Ship) => {
    let modifiedPlanets
    let modifiedShips
    const planet = getShipPlanet(planets, ship)

    if (planet && canModifyShipAtPlanet(player, ship, planet)) {
        const planetIndex = planets.indexOf(planet)
        const shipIndex = ships.findIndex((s) => s.id === ship.id)

        if (planetIndex === -1 || shipIndex === -1) {
            throw new Error(`Invalid planet (${planetIndex}) or ship (${shipIndex}) index`)
        }

        modifiedPlanets = [...planets]
        const modifiedPlanet = { ...planet }

        modifiedShips = [...ships]
        const modifiedShip = { ...ship }

        unloadCargo(modifiedShip, modifiedPlanet)

        modifiedPlanets[planetIndex] = modifiedPlanet
        modifiedShips[shipIndex] = modifiedShip
    }

    return [modifiedPlanets ?? planets, modifiedShips ?? ships] as const
}

export const decommissionShip = (player: string, planets: Planet[], ships: Ship[], ship: Ship) => {
    let modifiedPlanets
    let modifiedShips
    const planet = getShipPlanet(planets, ship)

    if (planet && canModifyShipAtPlanet(player, ship, planet)) {
        const planetIndex = planets.indexOf(planet)
        const shipIndex = ships.findIndex((s) => s.id === ship.id)

        if (planetIndex === -1 || shipIndex === -1) {
            throw new Error(`Invalid planet (${planetIndex}) or ship (${shipIndex}) index`)
        }

        modifiedPlanets = [...planets]
        const modifiedPlanet = { ...planet }
        const modifiedShip = { ...ship }

        modifiedPlanet.credits += modifiedShip.value
        modifiedShip.value = 0

        unloadCargo(modifiedShip, planet)

        planet.population += ship.passengers
        ship.passengers = 0

        if (ship.fuels !== "nuclear") {
            planet.fuels += ship.fuels
            ship.fuels = 0
        }

        planet.population += ship.crew
        ship.crew = 0

        modifiedPlanets[planetIndex] = modifiedPlanet

        ships.splice(shipIndex, 1)
        modifiedShips = [...ships]
    }

    return [modifiedPlanets ?? planets, modifiedShips ?? ships] as const
}

export const modifyShipPassengers = (
    player: string,
    planets: Planet[],
    ships: Ship[],
    ship: Ship,
    quantity: number,
) => {
    let modifiedPlanets
    let modifiedShips
    const planet = getShipPlanet(planets, ship)

    if (planet && canModifyShipAtPlanet(player, ship, planet)) {
        if (quantity > 0 && ship.passengers >= ship.capacity.civilians) {
            console.warn(`Ship ${ship.name} does not have space for more passengers`)
        } else if (quantity < 0 && ship.passengers === 0) {
            console.error(`Ship ${ship.name} does not have any passengers to unload`)
        } else {
            const planetIndex = planets.indexOf(planet)
            const shipIndex = ships.findIndex((s) => s.id === ship.id)

            if (planetIndex === -1 || shipIndex === -1) {
                throw new Error(`Invalid planet (${planetIndex}) or ship (${shipIndex}) index`)
            }

            const toMove =
                quantity > 0
                    ? Math.min(ship.capacity.civilians - ship.passengers, planet.population, quantity)
                    : -Math.min(PLANET_POPULATION_LIMIT - planet.population, ship.passengers, Math.abs(quantity))

            modifiedPlanets = [...planets]
            const modifiedPlanet = { ...planet }

            modifiedShips = [...ships]
            const modifiedShip = { ...ships[shipIndex] }

            modifiedPlanet.population -= toMove
            modifiedShip.passengers += toMove

            modifiedPlanets[planetIndex] = modifiedPlanet
            modifiedShips[shipIndex] = modifiedShip
        }
    }

    return [modifiedPlanets ?? planets, modifiedShips ?? ships] as const
}

export const modifyShipFuel = (player: string, planets: Planet[], ships: Ship[], ship: Ship, quantity: number) => {
    let modifiedPlanets
    let modifiedShips
    const planet = getShipPlanet(planets, ship)

    if (planet && canModifyShipAtPlanet(player, ship, planet)) {
        if (ship.fuels === "nuclear") {
            console.warn(`Ship ${ship.name} does not require fuel`)
        } else if (quantity > 0 && ship.fuels >= ship.capacity.fuels) {
            console.warn(`Ship ${ship.name} does not have space for more fuel`)
        } else if (quantity < 0 && ship.fuels === 0) {
            console.error(`Ship ${ship.name} does not have any fuel to unload`)
        } else {
            const planetIndex = planets.indexOf(planet)
            const shipIndex = ships.findIndex((s) => s.id === ship.id)

            if (planetIndex === -1 || shipIndex === -1) {
                throw new Error(`Invalid planet (${planetIndex}) or ship (${shipIndex}) index`)
            }

            const toMove =
                quantity > 0
                    ? Math.min(ship.capacity.fuels - ship.fuels, planet.fuels, quantity)
                    : -Math.min(ship.fuels, Math.abs(quantity))

            modifiedPlanets = [...planets]
            const modifiedPlanet = { ...planet }

            modifiedShips = [...ships]
            const modifiedShip = { ...ships[shipIndex] }

            modifiedPlanet.fuels -= toMove
            modifiedShip.fuels = ship.fuels - toMove

            modifiedPlanets[planetIndex] = modifiedPlanet
            modifiedShips[shipIndex] = modifiedShip
        }
    }

    return [modifiedPlanets ?? planets, modifiedShips ?? ships] as const
}

export const modifyCargo = (
    player: string,
    planets: Planet[],
    ships: Ship[],
    ship: Ship,
    cargo: Resource,
    quantity: number,
) => {
    let modifiedPlanets
    let modifiedShips
    const planet = getShipPlanet(planets, ship)

    if (planet && canModifyShipAtPlanet(player, ship, planet)) {
        const currentCargo = getShipCurrentCargoAmount(ship)

        if (quantity > 0 && currentCargo >= ship.capacity.cargo) {
            console.warn(`Ship ${ship.name} does not have space for more cargo`)
        } else if (quantity < 0 && ship.cargo[cargo] === 0) {
            console.error(`Ship ${ship.name} does not have any ${cargo} to unload`)
        } else {
            const planetIndex = planets.indexOf(planet)
            const shipIndex = ships.findIndex((s) => s.id === ship.id)

            if (planetIndex === -1 || shipIndex === -1) {
                throw new Error(`Invalid planet (${planetIndex}) or ship (${shipIndex}) index`)
            }

            const toMove =
                quantity > 0
                    ? Math.min(ship.capacity.cargo - currentCargo, planet[cargo], quantity)
                    : -Math.min(ship.cargo[cargo], Math.abs(quantity))

            modifiedPlanets = [...planets]
            const modifiedPlanet = { ...planet }

            modifiedShips = [...ships]
            const modifiedShip = { ...ships[shipIndex] }

            modifiedPlanet[cargo] -= toMove
            modifiedShip.cargo[cargo] += toMove

            modifiedPlanets[planetIndex] = modifiedPlanet
            modifiedShips[shipIndex] = modifiedShip
        }
    }

    return [modifiedPlanets ?? planets, modifiedShips ?? ships] as const
}

export const transferShip = (
    player: string,
    planets: Planet[],
    ships: Ship[],
    shipArg: ShipInOrbit,
    targetPlanet: Planet,
) => {
    let modifiedShips

    const [shipIndex, ship] = findShip(shipArg, ships)

    if (ship.position === "orbit") {
        const currentLocation = ship.location
        if (currentLocation.planet === targetPlanet.id) {
            console.error(`Ship ${ship.name} is already at plant ${targetPlanet.name}`)
        } else {
            modifiedShips = [...ships]
            const modifiedShip: Ship = {
                ...ships[shipIndex],
                position: "outer-space",
                heading: {
                    from: currentLocation.planet,
                    to: targetPlanet.id,
                    duration: 5,
                    remaining: TRAVEL_TIME_MULTIPLIER * 5, // FIXME
                },
            }
            modifiedShips[shipIndex] = modifiedShip
        }
    } else {
        console.error(`Ship ${ship.name} cannot travel when not in orbit`)
    }

    return modifiedShips ?? ships
}

export const toggleShip = (player: string, planets: Planet[], ships: Ship[], ship: Ship, enabled: boolean) => {
    let modifiedShips
    const planet = getShipPlanet(planets, ship)

    if (planet && canModifyShipAtPlanet(player, ship, planet)) {
        if (ship.crew !== ship.requiredCrew) {
            console.error(`Ship ${ship.name} does not have the required crew`)
        } else if (ship.class !== "Core Mining Station" && ship.class !== "Horticultural Station") {
            console.error(`Ship ${ship.name} (${ship.class}) cannot be activated`)
        } else {
            const shipIndex = ships.findIndex((s) => s.id === ship.id)

            if (shipIndex === -1) {
                throw new Error(`Invalid ship (${shipIndex}) index`)
            }

            modifiedShips = [...ships]
            const modifiedShip = { ...ships[shipIndex], active: enabled }
            modifiedShips[shipIndex] = modifiedShip
        }
    }

    return modifiedShips ?? ships
}
