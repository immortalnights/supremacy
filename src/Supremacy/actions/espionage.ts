import { ColonizedPlanet } from "#Supremacy/entities"
import { EspionageReport, Player, SpyLevel } from "#Supremacy/types"

const spyCosts: Record<SpyLevel, number> = {
    Resources: 1000,
    Population: 1520,
    "War Status": 2200,
    Everything: 4720,
}

export const canSpyOnPlanet = (
    player: Player,
    capital: ColonizedPlanet,
    planet: ColonizedPlanet,
    level: SpyLevel,
): boolean => {
    let canSpy = false

    if (planet.owner === player.id) {
        // Cannot spy on own planet
    } else if (capital.credits < spyCosts[level]) {
        // Not enough credits to spy
        console.warn(`Capital ${capital.name} does not have enough credits to spy on planet ${planet.name}`)
    } else {
        canSpy = true
    }

    return canSpy
}

export const applySpyOnPlanet = (
    player: Player,
    capital: ColonizedPlanet,
    planet: ColonizedPlanet,
    level: SpyLevel,
): ColonizedPlanet => {
    const credits = capital.credits - spyCosts[level]

    let report: EspionageReport

    if (player.bot && player.espionageReports[planet.id]) {
        report = player.espionageReports[planet.id]
    } else {
        report = {
            food: 0,
            minerals: 0,
            fuels: 0,
            energy: 0,
            strength: 0,
            population: 0,
        }
    }

    if (level === "Resources" || level === "Everything") {
        report.food = planet.food
        report.minerals = planet.minerals
        report.fuels = planet.fuels
        report.energy = planet.energy
    }

    if (level === "Population" || level === "Everything") {
        report.population = planet.population
    }

    if (level === "War Status" || level === "Everything") {
        report.strength = 0
    }

    if (player.bot) {
        player.espionageReports[planet.id] = report
    }

    return { ...capital, credits }
}
