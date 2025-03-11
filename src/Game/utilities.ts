import { MouseEvent } from "react"
import { type Difficulty, difficulties } from "Supremacy/types"

export const wrap = (value: number, max: number, base: number = 0) => {
    let next = value
    if (value > max - 1) {
        next = base
    } else if (value < base) {
        next = max - 1
    }

    return next
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
