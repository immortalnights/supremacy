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
    nextFreeIndex,
} from "./Shipyard/utilities"

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

export const purchaseShip = (
    player: string,
    planets: Planet[],
    ships: Ship[],
    blueprint: ShipBlueprint,
    name: string,
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
        } else if (!canAffordShip(capital, blueprint.cost)) {
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

                const modifiedPlanet = deductShipCost(capital, blueprint.cost)
                modifiedPlanets[index] = modifiedPlanet

                const newShip = commissionShip(
                    blueprint,
                    name,
                    modifiedPlanet,
                    availableBayIndex,
                )
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

    if (planet) {
        if (planet.owner !== player) {
            console.error(
                `Planet ${ship.name} is not owned by player ${player}`,
            )
        } else if (ship.owner !== player) {
            console.error(`Ship ${ship.name} is not owned by player ${player}`)
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
) => {}

export const decommissionShip = (
    player: string,
    planets: Planet[],
    ships: Ship[],
    ship: Ship,
) => {
    let modifiedPlanets
    let modifiedShips
    const planet = getShipPlanet(planets, ship)

    if (planet) {
        if (planet.owner !== player) {
            console.error(
                `Planet ${ship.name} is not owned by player ${player}`,
            )
        } else if (ship.owner !== player) {
            console.error(`Ship ${ship.name} is not owned by player ${player}`)
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
            modifiedPlanet.credits += ship.value
            modifiedPlanets[planetIndex] = modifiedPlanet

            ships.splice(shipIndex, 1)
            modifiedShips = [...ships]
        }
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

    if (planet) {
        if (planet.owner !== player) {
            console.error(
                `Planet ${ship.name} is not owned by player ${player}`,
            )
        } else if (ship.owner !== player) {
            console.error(`Ship ${ship.name} is not owned by player ${player}`)
        } else if (ship.passengers >= ship.capacity.civilians) {
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

            const toMove = Math.min(
                ship.capacity.civilians - ship.passengers,
                planet.population,
                quantity,
            )

            modifiedPlanets = [...planets]

            const modifiedPlanet = {
                ...planets[planetIndex],
            } as ColonizedPlanet
            modifiedPlanet.population -= toMove
            modifiedPlanets[planetIndex] = modifiedPlanet

            modifiedShips = [...ships]
            const modifiedShip = { ...ships[shipIndex] }
            modifiedShip.passengers += toMove
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

    if (planet) {
        if (planet.owner !== player) {
            console.error(
                `Planet ${ship.name} is not owned by player ${player}`,
            )
        } else if (ship.owner !== player) {
            console.error(`Ship ${ship.name} is not owned by player ${player}`)
        } else if (ship.fuels >= ship.capacity.fuels) {
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

            const toMove = Math.min(
                ship.capacity.fuels - ship.fuels,
                planet.fuels,
                quantity,
            )

            modifiedPlanets = [...planets]

            const modifiedPlanet = {
                ...planets[planetIndex],
            } as ColonizedPlanet
            modifiedPlanet.fuels -= toMove
            modifiedPlanets[planetIndex] = modifiedPlanet

            modifiedShips = [...ships]
            const modifiedShip = { ...ships[shipIndex] }
            modifiedShip.fuels += toMove
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
) => {}
