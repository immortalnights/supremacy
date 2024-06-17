export interface Planet {
    id: string
    gridIndex: number
    name: string
    owner?: string
    capital?: boolean
    credits?: number
    food?: number
    minerals?: number
    fuels?: number
    energy?: number
    population?: number
    growth?: number
    moral?: number
    tax?: number
}

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
    location: {
        planet?: Planet["id"]
        position: "landed" | "docked" | "orbit" | "outer-space"
        // Bay or Planet Surface numeric location
        index?: number
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
