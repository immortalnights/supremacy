export interface Planet {
    id: string | number
    name: string
    owner?: string
}

export interface Ship {
    id: string
    name: string
    owner: string
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
