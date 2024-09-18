import { MouseEvent } from "react"
import { ColonizedPlanet, Planet, Ship } from "./entities"
import { type Difficulty, difficulties } from "./types"

export const random = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min)
}

export const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value))
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

export const isColonizedPlanet = (planet: Planet): planet is ColonizedPlanet =>
    planet.type !== "lifeless"

export const shipInLocation = (ships: Ship[], index: number) => {
    return ships.find(
        (ship) =>
            !(
                ship.location.position == "outer-space" ||
                ship.location.position == "orbit"
            ) && ship.location.index === index,
    )
}

export const shipsDockedAtPlanet = (
    ships: Ship[],
    planet: Planet,
    sort = true,
) => {
    const dockedShips = ships.filter(
        (ship) =>
            ship.location.position === "docked" &&
            ship.location.planet === planet.id,
    )

    if (sort) {
        dockedShips.sort(
            (a, b) =>
                (a.location.position === "docked" ? a.location.index : 0) -
                (b.location.position === "docked" ? b.location.index : 0),
        )
    }

    return dockedShips
}

export const shipsOnPlanetSurface = (
    ships: Ship[],
    planet: Planet,
    sort = true,
) => {
    const surfaceShips = ships.filter(
        (ship) =>
            ship.location.position === "surface" &&
            ship.location.planet === planet.id,
    )

    if (sort) {
        surfaceShips.sort(
            (a, b) =>
                (a.location.position === "surface" ? a.location.index : 0) -
                (b.location.position === "surface" ? b.location.index : 0),
        )
    }

    return surfaceShips
}
