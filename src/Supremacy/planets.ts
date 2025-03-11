// import { NotifyCallback } from "Game/components/Notification/useNotification"
import { ColonizedPlanet, Planet } from "./entities"
import { clamp, clone } from "./utilities"

export const getPlayerPlanets = (planets: Planet[], player: string) => {
    return planets.filter(
        (planet) => isColonizedPlanet(planet) && planet.owner === player,
    ) as ColonizedPlanet[]
}

export const getPlayerCapital = (planets: Planet[], player: string) => {
    const index = planets.findIndex(
        (p) => isColonizedPlanet(p) && p.capital && p.owner === player,
    )

    if (index === -1) {
        throw new Error(`Failed to find capital planet for player ${player}`)
    }

    return [index, planets[index] as ColonizedPlanet] as const
}

export const getColonizedPlanet = (planets: Planet[], planetOrId: Planet | string) => {
    const id = typeof planetOrId === "string" ? planetOrId : planetOrId.id
    return planets.find(
        (p): p is ColonizedPlanet => p.id === id && isColonizedPlanet(p),
    )
}

export const isColonizedPlanet = (planet: Planet): planet is ColonizedPlanet =>
    planet.type !== "lifeless"

export const applyRenamePlanet = (
    player: string,
    planets: Planet[],
    id: string,
    newName: string,
) => {
    const cpy = [...planets]

    const index = cpy.findIndex((p) => p.id === id)
    if (index !== -1) {
        const planet = cpy[index]
        if (planet.type !== "lifeless" && planet.owner === player) {
            console.log(
                `Renaming planet '${planet.name}' (${planet.id}) to '${newName}'`,
            )
            cpy[index] = { ...planet, name: newName }
        }
    }

    return cpy
}

export const applyModifyTax = (
    player: string,
    planets: Planet[],
    id: string,
    newTax: number,
) => {
    const cpy = [...planets]
    const index = cpy.findIndex((p) => p.id === id)
    if (index !== -1) {
        const planet = cpy[index]

        if (planet.type !== "lifeless" && planet.owner === player) {
            const tax = clamp(newTax, 0, 100)
            console.log(
                `Setting planet '${planet.name}' (${planet.id}) tax to '${tax}'`,
            )
            cpy[index] = { ...planet, tax }
        }
    }

    return cpy
}

export const modifyAggression = (
    player: string,
    planets: Planet[],
    planet: Planet,
    aggression: number,
) => {
    let modifiedPlanets
    if (isColonizedPlanet(planet)) {
        if (
            !(player in planet.aggression) ||
            planet.aggression[player] !== aggression
        ) {
            let modifiedPlanet
            ;[modifiedPlanet, modifiedPlanets] = clone(planet, planets)

            modifiedPlanet.aggression[player] = clamp(aggression, 0, 100)
        }
    }

    return modifiedPlanets ?? planets
}

export const transferCreditsToCapital = (
    player: string,
    planets: Planet[],
    // notify: NotifyCallback,
) => {
    const ownedPlanets = getPlayerPlanets(planets, player)
    const [, capital] = getPlayerCapital(ownedPlanets, player)
    let modifiedPlanets

    if (!capital) {
        throw new Error(`Failed to find player capital`)
    }

    if (ownedPlanets.length <= 1) {
        console.debug(`Player has no other planets to transfer credits from`)
        // notify("You have no other planets")
    } else {
        let modifiedPlanet
        let modifiedCapital

        let transferred = 0

        modifiedPlanets = planets
        for (let planet of ownedPlanets) {
            if (!planet.capital) {
                ;[modifiedPlanet, modifiedPlanets] = clone(planet, modifiedPlanets)
                transferred += modifiedPlanet.credits
                modifiedPlanet.credits = 0
            }
        }

        ;[modifiedCapital, modifiedPlanets] = clone(capital, modifiedPlanets)
        modifiedCapital.credits += transferred
        // notify(`All credits sent to ${capital.name}`)
        console.debug(
            `Transferred ${transferred} from ${ownedPlanets.length - 1} planets to player capital`,
        )
    }

    return modifiedPlanets ?? planets
}
