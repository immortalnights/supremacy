import {
    Planet,
    Ship,
    ShipPosition,
    isDocketAtPlanet,
    isOnPlanetSurface,
    isAtmos,
    Atmos,
    ColonizedPlanet,
    ShipInOuterSpace,
} from "../entities"
import { nextFreeIndex } from "../utilities"

export const canRepositionShip = (
    ship: Ship,
    planet: ColonizedPlanet,
    shipsAtPlanet: Ship[],
    targetPosition: ShipPosition,
): boolean => {
    let canReposition = false

    switch (targetPosition) {
        case "docked": // Docking
            if (ship.position === "surface" || ship.position === "orbit") {
                const dockedAtPlanet = shipsAtPlanet.filter((s) => s.position === "docked")
                if (dockedAtPlanet.length < 3) {
                    canReposition = true
                } else {
                    console.error(`Cannot reposition ship ${ship.name} to docked, docking bays are full`)
                }
            } else {
                console.error(`Cannot reposition ship ${ship.name} to docked from ${ship.position}`)
            }
            break
        case "surface":
            if (ship.owner === planet.owner && ship.position === "docked") {
                const onSurfaceOfPlanet = shipsAtPlanet.filter((s) => s.position === "surface")
                if (onSurfaceOfPlanet.length < 6) {
                    canReposition = true
                } else {
                    console.error(`Cannot reposition ship ${ship.name} to surface, all locations are full`)
                }
            } else {
                console.error(`Cannot reposition ship ${ship.name} to surface from ${ship.position}`)
            }
            break
        case "orbit":
            if (ship.position === "docked") {
                // Launching
                if (ship.requiredCrew !== "remote" && ship.crew !== ship.requiredCrew) {
                    console.error(`Cannot reposition ship ${ship.name} to orbit without full crew`)
                } else if (ship.fuels !== "nuclear" && ship.fuels <= 100) {
                    console.error(
                        `Cannot reposition ship ${ship.name} to orbit without at least 100 fuels (have ${ship.fuels})`,
                    )
                } else {
                    canReposition = true
                }
            } else if (ship.position === "outer-space") {
                // Arriving
                canReposition = true
            } else {
                console.error(`Cannot reposition ship ${ship.name} to orbit from ${ship.position}`)
            }
            break
        case "outer-space":
            // Transferring
            if (ship.position === "orbit") {
                canReposition = true
            } else {
                console.error(`Cannot reposition ship ${ship.name} to outer-space from ${ship.position}`)
            }
            break
        default:
            console.error(`Unsupported target position: ${targetPosition}`)
            return false
    }

    return canReposition
}

export const applyRepositionShip = (
    ship: Ship,
    planet: ColonizedPlanet,
    shipsAtPlanet: Ship[],
    targetPosition: ShipPosition,
): Ship => {
    let modifiedShip: Ship

    switch (targetPosition) {
        case "docked": {
            const dockedAtPlanet = shipsAtPlanet.filter((s) => s.position === "docked")
            const index = nextFreeIndex(dockedAtPlanet, 3)
            if (index === undefined) {
                throw new Error(
                    `Failed to identify free dock index for ${planet.id} with ships ${dockedAtPlanet.length}`,
                )
            }
            modifiedShip = { ...ship, position: "docked", location: { planet: planet.id, index } }
            break
        }
        case "surface":
            const onSurfaceOfPlanet = shipsAtPlanet.filter((s) => s.position === "surface")
            const index = nextFreeIndex(onSurfaceOfPlanet, 6)
            if (index === undefined) {
                throw new Error(
                    `Failed to identify free surface index for ${planet.id} with ships ${onSurfaceOfPlanet.length}`,
                )
            }
            // @ts-expect-error: ignore type error for outer-space assignment
            modifiedShip = { ...ship, position: "surface", location: { planet: planet.id, index } }
            break
        case "orbit":
            modifiedShip = { ...ship, position: "orbit", location: { planet: planet.id } }
            if (modifiedShip.fuels !== "nuclear") {
                modifiedShip.fuels = modifiedShip.fuels - 100
            }
            break
        case "outer-space":
            // @ts-expect-error: ignore type error for outer-space assignment
            modifiedShip = { ...ship, position: "outer-space" }
            break
        default: {
            console.error(`Unsupported target position: ${targetPosition}`)
            throw new Error(`Unsupported target position: ${targetPosition}`)
        }
    }

    return modifiedShip
}
