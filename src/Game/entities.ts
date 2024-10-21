interface BasePlanet {
    id: string
    gridIndex: number
    name: string
    type: "lifeless" | "metropolis" | "volcanic" | "dessert" | "tropical"
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
    type: "metropolis" | "volcanic" | "dessert" | "tropical"
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

interface Location {
    position: ShipPosition
}

interface InOrbit extends Location {
    position: "orbit"
    planet: Planet["id"]
}

interface Docked extends Location {
    position: "docked"
    planet: Planet["id"]
    index: number
}

interface Surface extends Location {
    position: "surface"
    planet: Planet["id"]
    index: number
}

interface OuterSpace extends Location {
    position: "outer-space"
    heading: {
        from: Planet["id"]
        to: Planet["id"]
        eta: number
    }
}

export interface Ship {
    id: string
    name: string
    class: ShipClass
    description: string
    owner: string
    requiredCrew: number
    crew: number
    fuels: number
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
    location: InOrbit | Docked | Surface | OuterSpace
    active: boolean
    value: number
}

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
        index?: number
    }
}

export type Platoon = StandbyPlatoon | EquippedPlatoon
