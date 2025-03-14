import {
    Atmos,
    ShipDocked,
    ShipInOrbit,
    ShipInOuterSpace,
    ShipOnSurface,
} from "Supremacy/entities"
import { colonizedPlanet } from "./planets"

const baseShip = {
    id: "1",
    name: "Ship",
    class: "B-29 Battle Cruiser" as const,
    description: "",
    owner: "local",
    requiredCrew: 0,
    crew: 0,
    fuels: 0,
    passengers: 0,
    capacity: {
        civilians: 0,
        cargo: 0,
        fuels: 0,
        platoons: 0,
    },
    cargo: {
        food: 0,
        minerals: 0,
        fuels: 0,
        energy: 0,
    },
    value: 0,
}

export const dockedShip: ShipDocked = {
    ...baseShip,
    position: "docked",
    location: {
        planet: colonizedPlanet.id,
        index: 0,
    },
}

export const surfaceShip: ShipOnSurface = {
    ...baseShip,
    position: "surface",
    location: { planet: colonizedPlanet.id, index: 0 },
    active: false,
}

export const orbitShip: ShipInOrbit = {
    ...baseShip,
    position: "orbit",
    location: { planet: colonizedPlanet.id },
}

export const spaceShip: ShipInOuterSpace = {
    ...baseShip,
    position: "outer-space",
    heading: { from: "0", to: colonizedPlanet.id, duration: 5, remaining: 1 },
}

export const atmosShip: Atmos = {
    ...baseShip,
    class: "Atmosphere Processor",
    fuels: "nuclear",
    position: "surface",
    location: {
        planet: colonizedPlanet.id,
        index: 0,
    },
    terraforming: {
        duration: 0,
        remaining: 0,
    },
    active: false,
}
