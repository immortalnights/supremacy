import { PLANET_POPULATION_LIMIT } from "../settings"
import {
    Planet,
    Ship,
    ColonizedPlanet,
    ShipBlueprint,
    CargoType,
} from "./entities"
import {
    canAffordShip,
    commissionShip,
    deductShipCost,
    getShipCurrentCargoAmount,
    nextFreeIndex,
    unloadCargo,
} from "./Shipyard/utilities"
import { Difficulty } from "./types"

const isColonizedPlanet = (planet: Planet): planet is ColonizedPlanet =>
    planet.type !== "lifeless"

const getShipPlanet = (planets: Planet[], ship: Ship) => {
    const planet: ColonizedPlanet | undefined = planets
        .filter(isColonizedPlanet)
        .find(
            (p) =>
                p.id === ship.location.planet &&
                ship.location.position === "docked",
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
        console.error(`Planet ${ship.name} is not owned by player ${player}`)
    } else if (ship.owner !== player) {
        console.error(`Ship ${ship.name} is not owned by player ${player}`)
    } else {
        ok = true
    }
    return ok
}

export const purchaseShip = (
    player: string,
    planets: Planet[],
    ships: Ship[],
    blueprint: ShipBlueprint,
    name: string,
    difficulty: Difficulty,
) => {
    let modifiedPlanets
    let modifiedShips
    // For now, purchases always get applied to the players capital, regardless of the selected planet
    const index = planets.findIndex(
        (p) => p.type !== "lifeless" && p.capital && p.owner === player,
    )

    if (index !== -1) {
        const capital = planets[index]
        // Count ships in planet docking bay
        const dockedShips = ships.filter(
            (s) =>
                s.location.planet === capital.id &&
                s.location.position === "docked",
        )

        if (capital.type === "lifeless") {
            console.error("Cannot purchase ships on a lifeless planet")
            // } else if (!planet.capital) {
            //     console.error("Cannot purchase ships from none capital planet")
        } else if (dockedShips.length >= 3) {
            console.error(
                "Cannot purchase ship, capital has no available docking bays",
            )
        } else if (!canAffordShip(capital, blueprint.cost, difficulty)) {
            console.log("Cannot afford ship")
        } else {
            const totalOwnedShips = ships.filter(
                (ship) => ship.owner === capital.owner,
            ).length
            const ownedShips = ships.filter(
                (ship) =>
                    ship.class === blueprint.class &&
                    ship.owner === capital.owner,
            ).length

            if (totalOwnedShips > 32) {
                console.error(
                    `Player ${capital.owner} cannot own more than 32 ships`,
                )
            } else if (
                blueprint.class === "Atmosphere Processor" &&
                ownedShips === 1
            ) {
                console.error(
                    `Player ${capital.owner} cannot own more than 1 Atmosphere Processor`,
                )
            } else {
                const availableBayIndex = nextFreeIndex(dockedShips, 3)
                if (availableBayIndex === -1) {
                    console.assert(
                        `Failed to identify free location index for ${capital.id} with ships ${dockedShips}`,
                    )
                }

                modifiedPlanets = [...planets]
                const modifiedPlanet = { ...capital }

                deductShipCost(capital, blueprint.cost, difficulty)

                modifiedPlanets[index] = modifiedPlanet

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
        if (ship.crew === ship.requiredCrew) {
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

            modifiedPlanets = [...planets]

            const modifiedPlanet = {
                ...planets[planetIndex],
            } as ColonizedPlanet
            modifiedPlanet.population -= ship.requiredCrew
            modifiedPlanets[planetIndex] = modifiedPlanet

            modifiedShips = [...ships]
            const modifiedShip = { ...ships[shipIndex] }
            modifiedShip.crew += modifiedShip.requiredCrew
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

        planet.fuels += ship.fuels
        ship.fuels = 0

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
            console.warn(
                `Ship ${ship.name} does not have space for more passengers`,
            )
        } else if (quantity < 0 && ship.passengers === 0) {
            console.error(
                `Ship ${ship.name} does not have any passengers to unload`,
            )
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
        if (quantity > 0 && ship.fuels >= ship.capacity.fuels) {
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
                    ? Math.min(
                          ship.capacity.fuels - ship.fuels,
                          planet.fuels,
                          quantity,
                      )
                    : -Math.min(ship.fuels, Math.abs(quantity))

            modifiedPlanets = [...planets]
            const modifiedPlanet = { ...planet }

            modifiedShips = [...ships]
            const modifiedShip = { ...ships[shipIndex] }

            modifiedPlanet.fuels -= toMove
            modifiedShip.fuels += toMove

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
            console.error(
                `Ship ${ship.name} does not have any ${cargo} to unload`,
            )
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
