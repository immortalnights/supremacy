import { ColonizedPlanet, Planet } from "Game/entities"
import { clamp, clone } from "Game/utilities"
import {
    getColonizedPlanet,
    getPlayerCapital,
    isColonizedPlanet,
} from "Game/utilities/planets"

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
    selectedPlanet: ColonizedPlanet,
) => {
    const planet = getColonizedPlanet(planets, selectedPlanet)
    const [, capital] = getPlayerCapital(planets, player)
    let modifiedPlanets

    if (!planet) {
        throw new Error(`Failed to find planet`)
    }
    if (!capital) {
        throw new Error(`Failed to find player capital`)
    }

    if (planet.capital) {
        console.debug(`Cannot transfer credits from the capital`)
    } else if (planet.owner !== player) {
        console.error(`Cannot transfer credits from an enemy planet`)
    } else {
        let modifiedPlanet
        let modifiedCapital
        ;[modifiedPlanet, modifiedPlanets] = clone(planet, planets)
        ;[modifiedCapital, modifiedPlanets] = clone(capital, modifiedPlanets)

        modifiedCapital.credits += modifiedPlanet.credits
        modifiedPlanet.credits = 0
    }

    return modifiedPlanets ?? planets
}
