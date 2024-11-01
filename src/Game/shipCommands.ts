import { throwError } from "game-signaling-server/client"
import { DAYS_PER_YEAR, PLANET_POPULATION_LIMIT } from "./settings"
import {
    Planet,
    Ship,
    ColonizedPlanet,
    ShipBlueprint,
    CargoType,
    ShipPosition,
    ShipInOrbit,
} from "./entities"
import {
    canAffordShip,
    deductShipCost,
    getShipCurrentCargoAmount,
    unloadCargo,
} from "./Shipyard/utilities"
import { Difficulty } from "./types"
import { getPlayerCapital, isColonizedPlanet } from "./utilities/planets"
import { clone, nextFreeIndex } from "./utilities"
import {
    canPurchaseAtmos,
    isDocketAtPlanet,
    isOnPlanetSurface,
} from "./utilities/ships"

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
        .find(
            (p) =>
                (ship.position === "docked" || ship.position === "surface") &&
                p.id === ship.location.planet,
        )

    if (!planet) {
        console.error(`Ship ${ship.name} is not docked at a planet`)
    }

    return planet
}

const canModifyShipAtPlanet = (
    player: string,
    ship: Ship,
    planet: ColonizedPlanet,
): boolean => {
    let ok = false
    if (planet.owner !== player) {
        console.error(`Planet ${planet.name} is not owned by player ${player}`)
    } else if (ship.owner !== player) {
        console.error(`Ship ${ship.name} is not owned by player ${player}`)
    } else {
        ok = true
    }
    return ok
}

const commissionShip = (
    ship: ShipBlueprint,
    name: string,
    planet: ColonizedPlanet,
    bayIndex: number,
): Ship => {
    const requiredCrew = ship.requiredCrew === 0 ? "remote" : ship.requiredCrew
    const fuels = ship.capacity.fuels === 0 ? "nuclear" : 0
    return {
        id: crypto.randomUUID(),
        name,
        description: ship.description,
        owner: planet.owner,
        class: ship.class,
        requiredCrew,
        crew: 0,
        fuels,
        passengers: 0,
        capacity: { ...ship.capacity },
        position: "docked",
        location: {
            planet: planet.id,
            index: bayIndex,
        },
        cargo: {
            food: 0,
            minerals: 0,
            fuels: 0,
            energy: 0,
        },
        value: ship.cost.credits,
    }
}

export const purchaseShip = (
    player: string,
    planets: Planet[],
    ships: Ship[],
    blueprint: ShipBlueprint,
    name: string,
    difficulty: Difficulty,
    date: number,
) => {
    let modifiedPlanets
    let modifiedShips
    // Purchases always get applied to the players capital, regardless of the selected planet
    const [capitalIndex, capital] = getPlayerCapital(planets, player)

    // Count ships in planet docking bay
    const dockedShips = ships.filter((ship) => isDocketAtPlanet(ship, capital))

    if (dockedShips.length >= 3) {
        console.error("Cannot purchase ship, capital has no available docking bays")
    } else if (!canAffordShip(capital, blueprint.cost, difficulty)) {
        console.log("Cannot afford ship")
    } else {
        const totalOwnedShips = ships.filter(
            (ship) => ship.owner === capital.owner,
        ).length
        const ownedShips = ships.filter(
            (ship) => ship.class === blueprint.class && ship.owner === capital.owner,
        ).length

        if (totalOwnedShips > 32) {
            console.error(`Player ${capital.owner} cannot own more than 32 ships`)
        } else if (
            blueprint.class === "Atmosphere Processor" &&
            !canPurchaseAtmos(date, ownedShips)
        ) {
            console.error("Cannot purchase Atmosphere Processor")
        } else {
            const availableBayIndex = nextFreeIndex(dockedShips, 3)
            if (!availableBayIndex) {
                console.assert(
                    `Failed to identify free location index for ${capital.id} with ships ${dockedShips}`,
                )
            }

            modifiedPlanets = [...planets]
            const modifiedPlanet = { ...capital }

            deductShipCost(capital, blueprint.cost, difficulty)

            modifiedPlanets[capitalIndex] = modifiedPlanet

            const newShip = commissionShip(
                blueprint,
                name,
                modifiedPlanet,
                availableBayIndex,
            )
            console.debug("new ship", newShip)
            modifiedShips = [...ships, newShip]
        }
    }

    return [modifiedPlanets ?? planets, modifiedShips ?? ships] as const
}

export const crewShip = (
    player: string,
    planets: Planet[],
    ships: Ship[],
    ship: Ship,
) => {
    let modifiedPlanets
    let modifiedShips
    const planet = getShipPlanet(planets, ship)

    if (planet && canModifyShipAtPlanet(player, ship, planet)) {
        if (ship.requiredCrew === "remote") {
            console.warn(`Ship ${ship.name} does not require crew`)
        } else if (ship.crew === ship.requiredCrew) {
            console.warn(`Ship ${ship.name} already has a full crew`)
        } else if (planet.population < ship.requiredCrew) {
            console.warn(
                `Planet ${planet.name} does not have the required population to crew ${ship.name} (${planet.population}/${ship.requiredCrew})`,
            )
        } else {
            const planetIndex = planets.indexOf(planet)
            const shipIndex = ships.findIndex((s) => s.id === ship.id)

            if (planetIndex === -1 || shipIndex === -1) {
                throw new Error(
                    `Invalid planet (${planetIndex}) or ship (${shipIndex}) index`,
                )
            }

            let modifiedPlanet
            ;[modifiedPlanet, modifiedPlanets] = clone(planet, planets)

            modifiedPlanet.population -= ship.requiredCrew
            modifiedPlanets[planetIndex] = modifiedPlanet

            let modifiedShip
            ;[modifiedShip, modifiedShips] = clone(ship, ships)

            modifiedShip.crew += ship.requiredCrew
            modifiedShips[shipIndex] = modifiedShip
        }
    }

    return [modifiedPlanets ?? planets, modifiedShips ?? ships] as const
}

/**
 * Unload all cargo
 */
export const unloadShipCargo = (
    player: string,
    planets: Planet[],
    ships: Ship[],
    ship: Ship,
) => {
    let modifiedPlanets
    let modifiedShips
    const planet = getShipPlanet(planets, ship)

    if (planet && canModifyShipAtPlanet(player, ship, planet)) {
        const planetIndex = planets.indexOf(planet)
        const shipIndex = ships.findIndex((s) => s.id === ship.id)

        if (planetIndex === -1 || shipIndex === -1) {
            throw new Error(
                `Invalid planet (${planetIndex}) or ship (${shipIndex}) index`,
            )
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

export const decommissionShip = (
    player: string,
    planets: Planet[],
    ships: Ship[],
    ship: Ship,
) => {
    let modifiedPlanets
    let modifiedShips
    const planet = getShipPlanet(planets, ship)

    if (planet && canModifyShipAtPlanet(player, ship, planet)) {
        const planetIndex = planets.indexOf(planet)
        const shipIndex = ships.findIndex((s) => s.id === ship.id)

        if (planetIndex === -1 || shipIndex === -1) {
            throw new Error(
                `Invalid planet (${planetIndex}) or ship (${shipIndex}) index`,
            )
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
                throw new Error(
                    `Invalid planet (${planetIndex}) or ship (${shipIndex}) index`,
                )
            }

            const toMove =
                quantity > 0
                    ? Math.min(
                          ship.capacity.civilians - ship.passengers,
                          planet.population,
                          quantity,
                      )
                    : -Math.min(
                          PLANET_POPULATION_LIMIT - planet.population,
                          ship.passengers,
                          Math.abs(quantity),
                      )

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

export const modifyShipFuel = (
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
                throw new Error(
                    `Invalid planet (${planetIndex}) or ship (${shipIndex}) index`,
                )
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
    cargo: CargoType,
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
                throw new Error(
                    `Invalid planet (${planetIndex}) or ship (${shipIndex}) index`,
                )
            }

            const toMove =
                quantity > 0
                    ? Math.min(
                          ship.capacity.cargo - currentCargo,
                          planet[cargo],
                          quantity,
                      )
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

const transitionMatrix: { [key in ShipPosition]: ShipPosition[] } = {
    // From : To
    orbit: ["docked", "outer-space"],
    surface: ["docked"],
    docked: ["surface", "orbit"],
    "outer-space": ["orbit"],
}

export const transitionShip = (
    player: string,
    planets: Planet[],
    ships: Ship[],
    shipArg: Ship,
    targetPosition: ShipPosition,
) => {
    let modifiedShips

    const [shipIndex, ship] = findShip(shipArg, ships)

    const currentPosition = ship.position
    if (!transitionMatrix[currentPosition].includes(targetPosition)) {
        console.error(
            `Cannot move ship ${ship.name} from ${currentPosition} to ${targetPosition}`,
        )
    } else {
        let planet
        if (
            ship.position === "orbit" ||
            ship.position === "docked" ||
            ship.position === "surface"
        ) {
            planet = planets.find((planet) => planet.id === ship.location.planet)
        }

        if (!planet) {
            throw new Error(`Failed to find ship planet`)
        }

        try {
            let changes: Partial<Ship> = {}
            switch (targetPosition) {
                case "docked": {
                    const dockedShips = ships.filter((ship) =>
                        isDocketAtPlanet(ship, planet),
                    )

                    if (planet.type === "lifeless") {
                        throw new Error("Cannot dock a ship on a lifeless planet")
                    } else if (dockedShips.length >= 3) {
                        throw new Error(`Planet ${planet.name} docking bays are full`)
                    } else {
                        // Any ship can dock at any planet, assuming there is space
                        changes = {
                            position: "docked",
                            location: {
                                planet: planet.id,
                                index: nextFreeIndex(dockedShips, 3),
                            },
                        }
                    }
                    break
                }
                case "surface": {
                    const landedShips = ships.filter((ship) =>
                        isOnPlanetSurface(ship, planet),
                    )

                    if (planet.type === "lifeless") {
                        throw new Error("Cannot land a ship on a lifeless planet")
                    } else if (planet.owner !== player) {
                        throw new Error(
                            `Player does not have permission to land a ship at planet ${planet.name}`,
                        )
                    } else if (landedShips.length >= 6) {
                        throw new Error(
                            `Planet ${planet.name} surface locations are full`,
                        )
                    } else {
                        // Any ship can dock at any planet, assuming there is space
                        changes = {
                            position: "surface",
                            location: {
                                planet: planet.id,
                                index: nextFreeIndex(landedShips, 6),
                            },
                        }
                    }
                    break
                }
                case "orbit": {
                    const landedShips = ships.filter((ship) =>
                        isOnPlanetSurface(ship, planet),
                    )

                    if (ship.position !== "docked") {
                        const maybePlanet =
                            ship.position !== "outer-space" ? ship.location.planet : "-"

                        throw new Error(
                            `Cannot launch a ship not currently docked at the target planet (${ship.position} at ${maybePlanet} target ${targetPlanet.id})`,
                        )
                    } else if (landedShips.length >= 3) {
                        throw new Error(`Planet ${planet.name} docking bays are full`)
                    } else if (
                        ship.requiredCrew !== "remote" &&
                        ship.crew !== ship.requiredCrew
                    ) {
                        throw new Error(
                            `Cannot launch ship ${ship.name} without full crew`,
                        )
                    } else if (ship.fuels !== "nuclear" && ship.fuels <= 100) {
                        throw new Error(
                            `Cannot launch ship ${ship.name} without at least 100 fuels (have ${ship.fuels})`,
                        )
                    } else {
                        let modifiedFuel = ship.fuels
                        if (ship.fuels !== "nuclear") {
                            modifiedFuel = ship.fuels - 100
                        }

                        changes = {
                            fuels: modifiedFuel,
                            position: "orbit",
                            location: {
                                planet: planet.id,
                            },
                        }
                    }
                    break
                }

                default: {
                    throw new Error(`Unsupported target position ${targetPosition}`)
                }
            }

            modifiedShips = [...ships]
            const modifiedShip: Ship = {
                ...ships[shipIndex],
                ...changes,
            }
            modifiedShips[shipIndex] = modifiedShip
        } catch (error) {
            console.error("Failed to transition ship", error)
        }
    }

    return modifiedShips ?? ships
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

    const currentLocation = ship.location

    if (ship.position === "orbit") {
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
                    eta: 5, // FIXME
                },
            }
            modifiedShips[shipIndex] = modifiedShip
        }
    } else {
        console.error(`Ship ${ship.name} cannot travel when not in orbit`)
    }

    return modifiedShips ?? ships
}

export const toggleShip = (
    player: string,
    planets: Planet[],
    ships: Ship[],
    ship: Ship,
    enabled: boolean,
) => {
    let modifiedShips
    const planet = getShipPlanet(planets, ship)

    if (planet && canModifyShipAtPlanet(player, ship, planet)) {
        if (ship.crew !== ship.requiredCrew) {
            console.error(`Ship ${ship.name} does not have the required crew`)
        } else if (
            ship.class !== "Core Mining Station" &&
            ship.class !== "Horticultural Station"
        ) {
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
