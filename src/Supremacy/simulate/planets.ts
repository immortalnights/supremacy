import { PLANET_POPULATION_LIMIT } from "../consts"
import { Planet, ColonizedPlanet } from "../entities"

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

const calculateGrowth = ({ morale, tax }: ColonizedPlanet) => {
    return morale * 0.33 - tax * 0.5
}

const simulatePlanet = (planet: ColonizedPlanet): Planet => {
    const modifiedPlanet = { ...planet }

    // Adjust morale
    modifiedPlanet.morale = calculateMorale(modifiedPlanet)
    // Adjust growth
    modifiedPlanet.growth = calculateGrowth(modifiedPlanet)
    // Apply population growth
    // Consume food
    modifiedPlanet.food = Math.max(Math.floor(modifiedPlanet.food - modifiedPlanet.population * 0.004), 0)

    const change = Math.floor(modifiedPlanet.population * (modifiedPlanet.growth / 100))
    if (change < 0) {
        // console.debug(
        //     `Planet ${modifiedPlanet.name} (${modifiedPlanet.id}) has decreasing population ${modifiedPlanet.morale}/${modifiedPlanet.growth}/${change}`,
        // )
    }
    modifiedPlanet.population = Math.min(modifiedPlanet.population + change, PLANET_POPULATION_LIMIT)
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
