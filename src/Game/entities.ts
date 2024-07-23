interface BasePlanet {
    id: string
    gridIndex: number
    name: string
    type: "lifeless" | "metropolis" | "volcanic" | "dessert" | "tropical"
}

export interface LifelessPlanet extends BasePlanet {
    type: "lifeless"
}

export interface PlanetResources {
    credits: number
    food: number
    minerals: number
    fuels: number
    energy: number
    population: number
}

export interface ColonizedPlanet extends BasePlanet, PlanetResources {
    type: "metropolis" | "volcanic" | "dessert" | "tropical"
    owner: string
    capital: boolean
    morale: number
    growth: number
    tax: number
}

export type Planet = LifelessPlanet | ColonizedPlanet

export interface Ship {
    id: string
    name: string
    owner: string
    class: "atmos" | "battle" | "cargo" | "farming" | "mining" | "solar"
    requiredCrew: number
    crew: number
    maxFuel: number
    fuel: number
    passengers: number
    passengerLimit: number
    cargoCapacity: number
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
