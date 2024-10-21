import { MouseEvent } from "react"
import { ColonizedPlanet, Planet, Ship } from "./entities"
import { type Difficulty, difficulties } from "./types"

export const clone = <
    TResource extends { id: string },
    TArray extends { id: string },
>(
    resource: TResource,
    array: TArray[],
): [TResource, TArray[]] => {
    const index = array.findIndex((item) => item.id === resource.id)

    if (index === -1) {
        console.error(`Failed to find ${resource.id} in array`, array)
        throw new Error(`Failed to find ${resource.id} in array`)
    }

    // Copy array
    const clonedArray = [...array]

    // Clone the resource
    const clonedResource = { ...array[index] }

    // Apply clone to array
    clonedArray[index] = clonedResource

    return [clonedResource as unknown as TResource, clonedArray] as const
}

export const random = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min)
}

export const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value))
}

export const wrap = (value: number, max: number, base: number = 0) => {
    let next = value
    if (value > max - 1) {
        next = base
    } else if (value < base) {
        next = max - 1
    }

    return next
}

export const calculateGrowth = ({ morale, tax }: ColonizedPlanet) => {
    return morale * 0.33 - tax * 0.5
}

export function isDifficulty(str: string | undefined): str is Difficulty {
    return !!difficulties.find((item) => str === item)
}

export const getModifierAmount = (event: MouseEvent, max: number = 1) => {
    let amount
    if (event.ctrlKey) {
        amount = max
    } else if (event.shiftKey) {
        amount = 100
    } else {
        amount = 1
    }
    return amount
}
