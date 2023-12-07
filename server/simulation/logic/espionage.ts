import EspionageData from "../data/espionage.json"
import type { IPlanet, IEspionageReport } from "../types"

export const calculateEspionageMissionCost = (mission: string) => {
    let cost = 0

    if (mission === "everything") {
        for (const [key, item] of Object.entries(EspionageData)) {
            cost += item.credits
        }
    } else {
        const item = EspionageData[mission as keyof typeof EspionageData]
        cost = item.credits
    }

    return cost
}

export const generateMissionReport = (
    planet: IPlanet,
    strength: number,
    mission: string
) => {
    const report: IEspionageReport = {
        date: 0,
        planet: {
            id: planet.id,
            name: planet.name,
        },
        food: undefined,
        minerals: undefined,
        fuels: undefined,
        energy: undefined,
        strength: undefined,
        civilians: undefined,
    }

    if (mission === "resources" || mission === "everything") {
        report.food = planet.resources.food
        report.minerals = planet.resources.minerals
        report.fuels = planet.resources.fuels
        report.energy = planet.resources.energy
    }

    if (mission === "population" || mission === "everything") {
        report.civilians = planet.population
    }

    if (mission === "warstatus" || mission === "everything") {
        report.strength = strength
    }

    return report
}
