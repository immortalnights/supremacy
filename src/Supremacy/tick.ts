import { ColonizedPlanet, LifelessPlanet, Planet, Platoon, Ship } from "./entities"
import { calculateGrowth } from "./utilities"
import { PLANET_POPULATION_LIMIT } from "./consts"
import { isColonizedPlanet } from "./planets"

// Pure simulation function
export const simulatePlatoons = (
    platoons: Platoon[],
    planets: Planet[],
): [Platoon[], Planet[]] => {
    return [platoons, planets]
}

const gatherFood = (ship: Ship, planet?: Planet) => {
    let modifiedShip = ship
    let modifiedPlanet
    if (planet && isColonizedPlanet(planet)) {
        if (ship.position === "surface" && ship.active) {
            if (planet.energy > 1) {
                modifiedPlanet = {
                    ...planet,
                    energy: planet.energy - 1,
                    food: planet.food + 12,
                } satisfies ColonizedPlanet
            } else {
                modifiedShip = { ...ship, active: false }
            }
        }
    }

    return [modifiedShip, modifiedPlanet] as const
}

const gatherFuelAndMinerals = (ship: Ship, planet?: Planet) => {
    let modifiedShip = ship
    let modifiedPlanet
    if (planet && isColonizedPlanet(planet)) {
        if (ship.position === "surface" && ship.active) {
            if (planet.energy > 1) {
                modifiedPlanet = {
                    ...planet,
                    energy: planet.energy - 1,
                    fuels: planet.fuels + 7,
                    minerals: planet.minerals + 2,
                } satisfies ColonizedPlanet
            } else {
                modifiedShip = { ...ship, active: false }
            }
        }
    }

    return [modifiedShip, modifiedPlanet] as const
}

const gatherEnergy = (ship: Ship, planet?: Planet) => {
    let modifiedShip = ship
    let modifiedPlanet
    if (planet && isColonizedPlanet(planet) && ship.position === "orbit") {
        modifiedPlanet = { ...planet, energy: planet.energy + 6 }
        modifiedShip = ship
    } else {
        modifiedShip = ship
    }

    return [modifiedShip, modifiedPlanet] as const
}

const terraformPlanet = (ship: Ship, planet?: Planet) => {
    let modifiedShip
    let modifiedPlanet
    if (
        ship.class === "Atmosphere Processor" &&
        planet?.type === "lifeless" &&
        ship.position === "surface"
    ) {
        modifiedShip = { ...ship }
        if (ship.terraforming.remaining === 0) {
            modifiedPlanet = {
                id: planet.id,
                gridIndex: planet.gridIndex,
                name: "unnamed", // FIXME
                type: planet.terraformedType,
                owner: ship.owner,
                capital: false,
                credits: 0,
                food: 0,
                minerals: 0,
                fuels: 0,
                energy: 0,
                population: 2000, // FIXME
                morale: 75,
                growth: 0,
                tax: 25,
                aggression: {},
            } as ColonizedPlanet
            modifiedShip.active = false
            modifiedShip.terraforming = undefined
        } else {
            modifiedShip.terraforming.remaining -= 1
        }
    } else {
        modifiedShip = ship
    }

    return [modifiedShip, modifiedPlanet] as const
}

const simulateTravel = (ship: Ship): Ship => {
    let modifiedShip
    if (ship.position === "outer-space") {
        const destination = ship.heading.to

        modifiedShip = {
            ...ship,
            position: "orbit" as const,
            location: { planet: destination },
        }
    } else {
        modifiedShip = ship
    }
    return modifiedShip
}

// Pure simulation function
export const simulateShips = (ships: Ship[], planets: Planet[]): [Ship[], Planet[]] => {
    // console.log(`Simulating ${ships.length} ships`)
    const getPlanet = (ship: Ship) =>
        ship.position !== "outer-space"
            ? modifiedPlanets.find((planet) => planet.id === ship.location.planet)
            : undefined

    const modifiedPlanets = [...planets]
    const modifiedShips = ships.map((ship) => {
        let modifiedShip: Ship | undefined = ship
        let modifiedPlanet: Planet | undefined
        switch (ship.class) {
            case "B-29 Battle Cruiser": {
                modifiedShip = simulateTravel(modifiedShip)
                break
            }
            case "Solar-Satellite Generator": {
                const planet = getPlanet(modifiedShip)
                ;[modifiedShip, modifiedPlanet] = gatherEnergy(modifiedShip, planet)
                modifiedShip = simulateTravel(modifiedShip)
                break
            }
            case "Atmosphere Processor": {
                const planet = getPlanet(modifiedShip)
                ;[modifiedShip, modifiedPlanet] = terraformPlanet(modifiedShip, planet)
                modifiedShip = simulateTravel(modifiedShip)

                // Atmos automatically lands on the destination planet
                if (
                    modifiedShip?.position === "orbit" &&
                    modifiedShip.heading.to === modifiedShip.location.planet
                ) {
                    const terraformPlanet = getPlanet(modifiedShip)
                    modifiedShip.position = "surface"
                    modifiedShip.terraforming = {
                        duration: terraformPlanet.terraformDuration,
                        remaining: terraformPlanet.terraformDuration,
                    }
                }
                break
            }
            case "Cargo Store / Carrier": {
                modifiedShip = simulateTravel(modifiedShip)
                break
            }
            case "Core Mining Station": {
                const planet = getPlanet(ship)
                ;[modifiedShip, modifiedPlanet] = gatherFuelAndMinerals(
                    modifiedShip,
                    planet,
                )
                modifiedShip = simulateTravel(modifiedShip)
                break
            }
            case "Horticultural Station": {
                const planet = getPlanet(ship)
                ;[modifiedShip, modifiedPlanet] = gatherFood(modifiedShip, planet)
                modifiedShip = simulateTravel(modifiedShip)
                break
            }
        }

        if (modifiedPlanet) {
            const index = planets.findIndex((planet) => planet.id === modifiedPlanet.id)
            modifiedPlanets[index] = modifiedPlanet
        }

        return modifiedShip
    })

    return [modifiedShips, modifiedPlanets] as const
}

const calculateMorale = ({ morale, tax, food }: ColonizedPlanet) => {
    if (food === 0) {
        morale = 1
    } else {
        const targetMorale = 100 - tax
        if (morale > targetMorale) {
            morale -= 1
        } else if (morale < targetMorale) {
            morale += 1
        }
    }

    return morale
}

const simulatePlanet = (planet: ColonizedPlanet): Planet => {
    const modifiedPlanet = { ...planet }

    // Consume food
    modifiedPlanet.food = Math.max(
        Math.floor(modifiedPlanet.food - modifiedPlanet.population * 0.004),
        0,
    )
    // Adjust morale
    modifiedPlanet.morale = calculateMorale(modifiedPlanet)
    // Adjust growth
    modifiedPlanet.growth = calculateGrowth(modifiedPlanet)
    // Apply population growth
    // eslint-disable-next-line no-constant-condition
    if (false) {
        modifiedPlanet.population = Math.min(
            modifiedPlanet.population +
                Math.floor(modifiedPlanet.population * (modifiedPlanet.growth / 100)),
            PLANET_POPULATION_LIMIT,
        )
    }
    // Collect taxes
    // FIXME tax should only be applied every _other_ day
    modifiedPlanet.credits += modifiedPlanet.population * (planet.tax * 0.008)

    return modifiedPlanet
}

// Pure simulation function
export const simulatePlanets = (planets: Planet[]): Planet[] => {
    return planets.map((planet) => {
        let modifiedPlanet
        if (planet.type === "lifeless") {
            modifiedPlanet = planet
        } else {
            modifiedPlanet = simulatePlanet(planet)
        }

        return modifiedPlanet
    })
}
