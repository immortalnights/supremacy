import {
    ColonizedPlanet,
    EquippedPlatoon,
    Planet,
    Platoon,
    Ship,
    SuitClass,
    WeaponClass,
} from "./entities"
import { calculateEquipPlatoonCost } from "./Training/utilities"
import { clone, nextFreeIndex } from "./utilities"
import { isColonizedPlanet } from "./utilities/planets"
import { isEquipped, isOnPlanet, isOnShip } from "./utilities/platoons"

// make generic and combine with Ship version?
const canModifyPlatoonAtPlanet = (
    player: string,
    platoon: Platoon,
    planet: ColonizedPlanet,
): boolean => {
    let ok = false
    if (planet.owner !== player) {
        console.error(`Planet ${planet.name} is not owned by player ${player}`)
    } else if (!planet.capital) {
        console.error(`Platoon ${platoon.index} is not at the capital planet`)
    } else {
        ok = true
    }
    return ok
}

const clamp = (quantity: number, value: number, available: number, max: number) => {
    return quantity > 0
        ? Math.min(max - value, available, quantity)
        : -Math.min(value, Math.abs(quantity))
}

export const modifyTroops = (
    player: string,
    planets: Planet[],
    platoons: Platoon[],
    platoon: Platoon,
    quantity: number,
) => {
    let modifiedPlanets
    let modifiedPlatoons

    if (platoon.owner !== player) {
        console.error(`Platoon ${platoon.index} is not owned by player ${player}`)
    } else if (platoon.state === "equipped") {
        console.error("Cannot modify platoon troops when equipped")
    } else {
        const capital = planets
            .filter(isColonizedPlanet)
            .find((planet) => planet.owner === player && planet.capital)

        if (!capital) {
            throw new Error("Failed to find player capital")
        }

        const planetIndex = planets.indexOf(capital)
        const platoonIndex = platoons.findIndex((s) => s.id === platoon.id)

        if (planetIndex === -1 || platoonIndex === -1) {
            throw new Error(
                `Invalid planet (${planetIndex}) or platoon (${platoonIndex}) index`,
            )
        }

        const change =
            quantity > 0
                ? Math.min(200 - platoon.size, capital.population, quantity)
                : -Math.min(platoon.size, Math.abs(quantity))

        const change2 = clamp(quantity, platoon.size, capital.population, 200)
        const originalSize = platoon.size

        console.assert(change === change2, "values are different")

        modifiedPlanets = [...planets]
        const modifiedPlanet = { ...capital }

        modifiedPlatoons = [...platoons]
        const modifiedPlatoon = { ...platoons[platoonIndex] }

        modifiedPlanet.population -= change2
        modifiedPlatoon.size += change2

        // Reset the platoon, if all troops are removed
        if (modifiedPlatoon.size === 0) {
            modifiedPlatoon.calibre = 0
            modifiedPlatoon.state = "standby"
        } else {
            modifiedPlatoon.state = "training"
        }

        if (modifiedPlatoon.calibre > 0 && change2 > 0) {
            // TODO reduce the current calibre based on troops added
        }

        modifiedPlanets[planetIndex] = modifiedPlanet
        modifiedPlatoons[platoonIndex] = modifiedPlatoon
    }

    return [modifiedPlanets ?? planets, modifiedPlatoons ?? platoons] as const
}

export const modifySuit = (
    player: string,
    platoons: Platoon[],
    platoon: Platoon,
    suit: SuitClass,
) => {
    let modifiedPlatoons

    if (platoon.owner !== player) {
        console.error(`Platoon ${platoon.index} is not owned by player ${player}`)
    } else if (platoon.state === "standby" || platoon.state === "training") {
        let modifiedPlatoon
        ;[modifiedPlatoon, modifiedPlatoons] = clone(platoon, platoons)

        modifiedPlatoon.suit = suit
    } else {
        console.error("Cannot modify platoon suit when equipped")
    }

    return modifiedPlatoons ?? platoons
}

export const modifyWeapon = (
    player: string,
    platoons: Platoon[],
    platoon: Platoon,
    weapon: WeaponClass,
) => {
    let modifiedPlatoons

    if (platoon.owner !== player) {
        console.error(`Platoon ${platoon.index} is not owned by player ${player}`)
    } else if (platoon.state === "standby" || platoon.state === "training") {
        let modifiedPlatoon
        ;[modifiedPlatoon, modifiedPlatoons] = clone(platoon, platoons)

        modifiedPlatoon.weapon = weapon
    } else {
        console.error("Cannot modify platoon weapon when equipped")
    }

    return modifiedPlatoons ?? platoons
}

export const equip = (
    player: string,
    planets: Planet[],
    platoons: Platoon[],
    platoon: Platoon,
) => {
    let modifiedPlanets
    let modifiedPlatoons

    if (platoon.owner !== player) {
        console.error(`Platoon ${platoon.id} is not owned by player ${player}`)
    } else if (platoon.state === "equipped") {
    } else if (platoon.size === 0) {
    } else {
        const capital = planets
            .filter(isColonizedPlanet)
            .find((planet) => planet.owner === player && planet.capital)

        if (!capital) {
            throw new Error("Failed to find player capital")
        }

        const cost = calculateEquipPlatoonCost(platoon)

        if (capital.credits < cost) {
            throw new Error(`Insufficient credits to equip platoon`)
        } else {
            let modifiedPlatoon
            ;[modifiedPlatoon, modifiedPlatoons] = clone(platoon, platoons)

            let modifiedPlanet
            ;[modifiedPlanet, modifiedPlanets] = clone(capital, planets)

            modifiedPlanet.credits -= cost

            Object.assign(modifiedPlatoon, {
                state: "equipped" as const,
                location: {
                    planet: capital.id,
                    ship: undefined,
                    index: nextFreeIndex(
                        platoons.filter((p) => isOnPlanet(p, capital, true)),
                        24,
                    ),
                },
            })
        }
    }

    return [modifiedPlanets ?? planets, modifiedPlatoons ?? platoons] as const
}

const transferPlatoon = (
    player: string,
    platoons: Platoon[],
    platoon: Platoon,
    direction: "load" | "unload",
    target: Ship | ColonizedPlanet,
    targetLimit: number,
) => {
    let modifiedPlatoons
    if (platoon.owner !== player) {
        console.error(`Platoon ${platoon.id} is not owned by player ${player}`)
    } else if (platoon.state !== "equipped") {
        console.error(`Platoon ${platoon.id} is not equipped`)
    } else {
        // FIXME?
        const platoonsAtLocation = platoons.filter(
            (platoon): platoon is EquippedPlatoon =>
                isEquipped(platoon) &&
                ((direction === "load" && isOnShip(platoon, target)) ||
                    (direction === "unload" && isOnPlanet(platoon, target, true))),
        ) as EquippedPlatoon[] // FIXME more

        const nextIndex = nextFreeIndex(platoonsAtLocation, targetLimit)
        if (nextIndex === undefined) {
            console.error(
                `Target location ${target.name} has no platoon capacity remaining`,
            )
        } else {
            let modifiedPlatoon
            ;[modifiedPlatoon, modifiedPlatoons] = clone(platoon, platoons)

            modifiedPlatoon.location = {
                planet: direction === "unload" ? target.id : undefined,
                ship: direction === "load" ? target.id : undefined,
                index: nextIndex,
            }
        }
    }

    return modifiedPlatoons ?? platoons
}

// Load a Platoon onto the selected Ship
export const loadPlatoon = (
    player: string,
    platoons: Platoon[],
    platoon: Platoon,
    ship: Ship,
) => {
    return transferPlatoon(player, platoons, platoon, "load", ship, 4)
}

// Unload a Platoon to the selected Planet
export const unloadPlatoon = (
    player: string,
    platoons: Platoon[],
    platoon: Platoon,
    planet: ColonizedPlanet,
) => {
    return transferPlatoon(player, platoons, platoon, "unload", planet, 24)
}
