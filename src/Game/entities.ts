export interface Planet {
    id: string | number
    name: string
    owner?: string
    credits: number
    food: number
    minerals: number
    fuels: number
    energy: number
    population: number
    growth: number
    moral: number
    tax: number
    strength: number
}

export interface Ship {
    id: string
    name: string
    owner: string
    class: ""
    crew: number
    fuel: number
    location: {
        planet?: Planet["id"]
        position: "landed" | "docked" | "orbit" | "outer-space"
        // Bay or Planet Surface numeric location
        index?: number
    }
    active: boolean
}

export interface Platoon {
    id: string
    name: string
    owner: string
}
