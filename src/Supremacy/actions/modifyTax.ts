import { clamp } from "#Supremacy/utilities"
import { ColonizedPlanet, Planet } from "../entities"

export const canModifyTax = (player: string, planet: Planet, newTax: number) => {
    let valid = false
    if (planet.type === "lifeless") {
        console.warn(`Cannot rename lifeless planet ${planet.id}`)
    } else if (planet.owner !== player) {
        console.warn(`Cannot rename planet ${planet.id} owned by ${planet.owner}`)
    } else if (newTax < 0) {
        console.warn(`Cannot set tax to a negative value: ${newTax}`)
    } else if (newTax > 100) {
        console.warn(`Cannot set tax above 100%: ${newTax}`)
    } else {
        valid = true
    }
    return valid
}

export const applyModifyTax = (planet: ColonizedPlanet, newTax: number) => {
    const tax = clamp(newTax, 0, 100)
    return { ...planet, tax }
}
