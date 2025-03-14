export const planetTypes = ["metropolis", "volcanic", "dessert", "tropical"] as const
export type PlanetType = "lifeless" | (typeof planetTypes)[number]

export const resourceTypes = ["food", "minerals", "fuels", "energy"] as const
export type Resource = (typeof resourceTypes)[number]

export type ResourceQuantities = {
    [key in Resource]: number
}

interface BasePlanet {
    id: string
    gridIndex: number
    name: string
    type: PlanetType
}

export interface LifelessPlanet extends BasePlanet {
    type: "lifeless"
    terraformedType: Exclude<PlanetType, "lifeless">
    terraformDuration: number
}

export interface ColonizedPlanet extends BasePlanet, ResourceQuantities {
    type: Exclude<PlanetType, "lifeless">
    owner: string
    capital: boolean
    credits: number
    population: number
    morale: number
    growth: number
    tax: number
    aggression: {
        [key: string]: number
    }
}

export type Planet = LifelessPlanet | ColonizedPlanet

export type ShipPosition = "orbit" | "surface" | "docked" | "outer-space"

export type ShipClass =
    | "B-29 Battle Cruiser"
    | "Solar-Satellite Generator"
    | "Atmosphere Processor"
    | "Cargo Store / Carrier"
    | "Core Mining Station"
    | "Horticultural Station"

export interface ShipBlueprint {
    class: ShipClass
    description: string
    shortName: string
    requiredCrew: number
    range: number
    capacity: {
        civilians: number
        cargo: number
        fuels: number
        platoons: number
    }
    cost: {
        credits: number
        energy: number
        minerals: number
    }
}

interface BaseShip {
    id: string
    name: string
    class: ShipClass
    description: string
    owner: string
    requiredCrew: number | "remote"
    crew: number
    fuels: number | "nuclear"
    passengers: number
    capacity: {
        civilians: number
        cargo: number
        fuels: number
        platoons: number
    }
    cargo: ResourceQuantities
    value: number
    position: ShipPosition
}

export interface ShipInOrbit extends BaseShip {
    position: "orbit"
    location: {
        planet: Planet["id"]
    }
}

export interface ShipDocked extends BaseShip {
    position: "docked"
    location: {
        planet: Planet["id"]
        index: number
    }
}

export interface ShipOnSurface extends BaseShip {
    position: "surface"
    location: {
        planet: Planet["id"]
        index: number
    }
    active: boolean
}

export interface ShipInOuterSpace extends BaseShip {
    position: "outer-space"
    heading: {
        from: Planet["id"]
        to: Planet["id"]
        duration: number
        remaining: number
    }
}

export type Ship = ShipInOrbit | ShipDocked | ShipOnSurface | ShipInOuterSpace | Atmos

export type Atmos = BaseShip & {
    class: "Atmosphere Processor"
    terraforming: {
        duration: number
        remaining: number
    }
} & (ShipInOrbit | ShipDocked | ShipOnSurface | ShipInOuterSpace)

export type SuitClass = "none" | "basic" | "moderate" | "advanced"

export type WeaponClass = "rifle" | "flamethrower" | "mortar"

export type PlatoonState = "standby" | "training" | "equipped"

interface BasePlatoon {
    id: string
    index: number
    owner: string
    size: number
    calibre: number
    state: PlatoonState
    weapon: WeaponClass
    suit: SuitClass
}

export interface StandbyPlatoon extends BasePlatoon {
    state: "standby" | "training"
}

export interface EquippedPlatoon extends BasePlatoon {
    state: "equipped"
    location: {
        planet?: Planet["id"]
        ship?: Ship["id"]
        index: number
    }
}

export type Platoon = StandbyPlatoon | EquippedPlatoon

// Type utilities
export const isLifelessPlanet = (planet: Planet): planet is LifelessPlanet =>
    planet.type === "lifeless"

export const isColonizedPlanet = (planet: Planet): planet is ColonizedPlanet =>
    planet.type !== "lifeless"

export const isShip = (obj: unknown): obj is Ship =>
    Boolean(obj && typeof obj === "object" && "id" in obj && "class" in obj)

export const isAtmos = (ship: Ship): ship is Atmos =>
    ship.class === "Atmosphere Processor"

export const isInOuterSpace = (ship: Ship): ship is ShipInOuterSpace =>
    ship.position === "outer-space"

export const isInOrbit = (ship: Ship): ship is ShipInOrbit => ship.position === "orbit"

export const isOrbitingPlanet = (ship: Ship, planet: Planet): ship is ShipInOrbit =>
    isInOrbit(ship) && ship.location.planet === planet.id

export const isDocked = (ship: Ship): ship is ShipDocked =>
    ship.position === "docked" && !!ship.location.planet

export const isDocketAtPlanet = (ship: Ship, planet: Planet): ship is ShipDocked =>
    isDocked(ship) && ship.location.planet === planet.id

export const isOnSurface = (ship: Ship): ship is ShipOnSurface =>
    ship.position === "surface"

export const isOnPlanetSurface = (ship: Ship, planet: Planet): ship is ShipOnSurface =>
    isOnSurface(ship) && ship.location.planet === planet.id

const modifyShip = (ship: Atmos): Ship => ({ ...ship })
