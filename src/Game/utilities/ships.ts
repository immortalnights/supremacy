import { Planet, Ship } from "Game/entities"

export const shipInLocation = (ships: Ship[], index: number) => {
    return ships.find(
        (ship) =>
            !(
                ship.location.position == "outer-space" ||
                ship.location.position == "orbit"
            ) && ship.location.index === index,
    )
}

// replace with platoonsOnPlanetAtom like function
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

// replace with platoonsOnPlanetAtom like function
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
