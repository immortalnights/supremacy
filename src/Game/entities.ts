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
}

export type Planet = LifelessPlanet | ColonizedPlanet

export type ShipPosition = "orbit" | "landed" | "docked" | "outer-space"

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
    location:
        | {
              planet: Planet["id"]
              position: "orbit"
          }
        | {
              planet: Planet["id"]
              position: "landed" | "docked"
              // Bay or Planet Surface numeric location
              index?: number
          }
        | {
              planet: undefined
              position: "outer-space"
              index: undefined
              heading: {
                  from: Planet["id"]
                  to: Planet["id"]
                  eta: number
              }
          }
    active: boolean
    value: number
}

export interface Platoon {
    id: string
    name: string
    owner: string
    size: number
    location: {
        planet?: Planet["id"]
        ship?: Ship["id"]
        index?: number
    }
}
