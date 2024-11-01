export type PlanetType = "lifeless" | "metropolis" | "volcanic" | "dessert" | "tropical"

interface BasePlanet {
    id: string
    gridIndex: number
    name: string
    type: PlanetType
}

export interface LifelessPlanet extends BasePlanet {
    type: "lifeless"
}

export const cargoTypes = ["food", "minerals", "fuels", "energy"] as const
export type CargoType = (typeof cargoTypes)[number]

export type PlanetResources = {
    [key in CargoType]: number
}

export interface ColonizedPlanet extends BasePlanet, PlanetResources {
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
    capacity: {
        civilians: number
        cargo: number
        fuels: number
        platoons: number
    }
    cost: {
        credits: 975
        energy: 92
        minerals: 7
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
    cargo: {
        [key in CargoType]: number
    }
    value: number
    position: ShipPosition
}

export interface ShipInOrbit {
    position: "orbit"
    location: {
        planet: Planet["id"]
    }
}

export interface ShipDocked {
    position: "docked"
    location: {
        planet: Planet["id"]
        index: number
    }
}

export interface ShipOnSurface {
    class: Exclude<ShipClass, "Atmosphere Processing">
    position: "surface"
    location: {
        planet: Planet["id"]
        index: number
    }
    active: boolean
}

export interface ShipInOuterSpace {
    position: "outer-space"
    heading: {
        from: Planet["id"]
        to: Planet["id"]
        eta: number
    }
}

export interface AtmosOnSurface {
    class: "Atmosphere Processor"
    position: "surface"
    location: {
        planet: Planet["id"]
        index: number
    }
    active: boolean
    terraforming: {
        duration: number
        remaining: number
    }
}

export type Ship = BaseShip &
    (ShipInOrbit | ShipDocked | ShipOnSurface | ShipInOuterSpace | AtmosOnSurface)

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
