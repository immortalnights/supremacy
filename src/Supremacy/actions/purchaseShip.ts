import { nextFreeIndex } from "#Supremacy/utilities"
import { DAYS_PER_YEAR } from "../consts"
import { ColonizedPlanet, Ship, ShipBlueprint, ShipDocked } from "../entities"
import { Difficulty } from "../types"

const deductShipCost = (
    planet: ColonizedPlanet,
    cost: ShipBlueprint["cost"],
    difficulty: Difficulty,
): ColonizedPlanet => {
    planet.credits = Math.max(planet.credits - cost.credits, 0)

    if (difficulty === "Normal" || difficulty === "Hard") {
        planet.energy = Math.max(planet.energy - cost.energy, 0)
    }

    if (difficulty === "Hard") {
        planet.minerals = Math.max(planet.minerals - cost.minerals, 0)
    }

    return planet
}

const commissionShip = (
    blueprint: ShipBlueprint,
    name: string,
    date: number,
    planet: ColonizedPlanet,
    bayIndex: number,
): Ship => {
    const requiredCrew = blueprint.requiredCrew === 0 ? "remote" : blueprint.requiredCrew
    const fuels = blueprint.capacity.fuels === 0 ? "nuclear" : 0
    return {
        id: crypto.randomUUID(),
        name,
        description: blueprint.description,
        owner: planet.owner,
        // purchased: date,
        class: blueprint.class,
        requiredCrew,
        crew: 0,
        fuels,
        passengers: 0,
        capacity: { ...blueprint.capacity },
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
        value: blueprint.cost.credits,
    }
}

const canPurchaseAtmos = (date: number, owned: number) => {
    // Unlock on the first day of the second year
    const unlock_day = DAYS_PER_YEAR
    let available = false

    if (date < unlock_day) {
        console.error(`Cannot purchase Atmosphere Processor yet (${date})`)
    } else if (owned > 0) {
        console.error("Cannot own more than one Atmosphere Processor")
    } else {
        available = true
    }

    return available
}

const canAffordShip = (planet: ColonizedPlanet, cost: ShipBlueprint["cost"], difficulty: Difficulty): boolean => {
    let canAfford = true
    if (planet.credits < cost.credits) {
        canAfford = false
        // console.error(
        //     `Cannot afford ship, missing ${planet.credits - cost.credits} credits (have ${planet.credits})`,
        // )
    }

    if (difficulty === "Normal" || difficulty === "Hard") {
        if (planet.energy < cost.energy) {
            canAfford = false
            // console.error(
            //     `Cannot afford ship, missing ${cost.energy} energy (have ${planet.energy})`,
            // )
        }
    }

    if (difficulty === "Hard") {
        if (planet.minerals < cost.minerals) {
            canAfford = false
            // console.error(
            //     `Cannot afford ship, missing ${cost.minerals} minerals (have ${planet.minerals})`,
            // )
        }
    }

    return canAfford
}

export const canPurchaseShip = (
    capital: ColonizedPlanet,
    ownedShips: Ship[],
    blueprint: ShipBlueprint,
    date: number,
    difficulty: Difficulty,
) => {
    let canPurchase = false
    const dockedShips = ownedShips.filter(
        (ship): ship is ShipDocked => ship.position === "docked" && ship.location.planet === capital.id,
    )
    const ownedAtmos = ownedShips.filter((ship) => ship.class === "Atmosphere Processor")

    if (dockedShips.length >= 3) {
        console.error("Cannot purchase ship, capital has no available docking bays")
    } else if (blueprint.class === "Atmosphere Processor" && !canPurchaseAtmos(date, ownedAtmos.length)) {
        console.error("Cannot purchase Atmosphere Processor")
    } else if (!canAffordShip(capital, blueprint.cost, difficulty)) {
        console.log("Cannot afford ship")
    } else {
        if (ownedShips.length > 32) {
            console.error(`Player cannot own more than 32 ships`)
        } else {
            canPurchase = true
        }
    }

    return canPurchase
}

export const applyPurchaseShip = (
    capital: ColonizedPlanet,
    ownedShips: Ship[],
    blueprint: ShipBlueprint,
    name: string | undefined,
    date: number,
    difficulty: Difficulty,
): [ColonizedPlanet, Ship] => {
    const ownedShipsOfClass = ownedShips.filter((ship) => ship.class === blueprint.class).length

    const dockedShips = ownedShips.filter(
        (ship): ship is ShipDocked => ship.position === "docked" && ship.location.planet === capital.id,
    )

    console.debug(`Owned ships ${ownedShips.length}; docked ships ${dockedShips.length}`)
    const availableBayIndex = nextFreeIndex(dockedShips, 3)
    if (availableBayIndex === undefined) {
        throw Error(`Failed to identify free location index for ${capital.id} with ships ${dockedShips.length}`)
    }

    const shipName = name || `${blueprint.shortName}${ownedShipsOfClass + 1}`

    const modifiedPlanet = { ...capital }

    deductShipCost(modifiedPlanet, blueprint.cost, difficulty)

    const newShip = commissionShip(blueprint, shipName, date, modifiedPlanet, availableBayIndex)

    return [modifiedPlanet, newShip] as const
}
