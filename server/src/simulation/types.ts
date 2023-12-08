import { IStaticShipHarvesting } from "./staticTypes"

export type PlayerGameAction =
    | "rename-planet"
    | "planet-modify-tax"
    | "planet-terraform"
    | "planet-espionage"
    | "planet-modify-aggression"
    | "transfer-credits"
    | "ship-purchase"
    | "ship-rename"
    | "ship-modify-passengers"
    | "ship-modify-fuels"
    | "ship-modify-cargo"
    | "ship-add-crew"
    | "ship-empty-cargo"
    | "ship-toggle-harvesting"
    | "ship-relocate"
    | "ship-travel"
    | "ship-abort-travel"
    | "ship-toggle-surface-status"
    | "ship-decommission"
    | "platoon-modify"
    | "platoon-recruit"
    | "platoon-dismiss"
    | "platoon-relocate"

export enum Difficulty {
    Easy,
    Medium,
    Hard,
    Impossible,
}

export type StarDate = number

export interface IResources {
    food: number
    minerals: number
    fuels: number
    energy: number
}

export interface IPlanetResources extends IResources {
    credits: number
}

export interface IPlanetHistory {
    credits: number[]
    population: number[]
    growth: number[]
    food: number[]
    minerals: number[]
    fuels: number[]
    energy: number[]
}

export enum PlanetType {
    Lifeless = "Lifeless",
    Volcanic = "Volcanic",
    Desert = "Desert",
    Tropical = "Tropical",
    Metropolis = "Metropolis",
}

export type PlanetID = number
export type ShipID = number
export type PlatoonID = number

export interface IPlanetBasic {
    id: PlanetID
    type: PlanetType
    owner?: string
    name: string
    aggression: number
    radius: number
    location: number // ? x pos
    terraforming: boolean
}

export interface IPlanet extends IPlanetBasic {
    habitable: boolean
    population: number
    terraformDuration: number

    capital: boolean
    growth: number
    morale: number
    tax: number
    status: string
    resources: IPlanetResources
    history: IPlanetHistory
    multipliers: boolean
}

export interface IShipLocation {
    planet: PlanetID | undefined
    position: string
    x: number
    y: number
}

export interface IShipCapacity {
    civilians: number
    cargo: number
    fuels: number
    platoons: number
}

export interface IShipHeading {
    location: PlanetID
    from: PlanetID
    to: PlanetID
    departed: StarDate
    arrival: StarDate
    fuels: number
}

export interface IShipHarvesting extends IStaticShipHarvesting {
    rate: number
    cooldown: number
}

export interface IShipHarvester {
    multiplier: number
    start: StarDate
}

export interface IShipTerraformer {
    start: StarDate
    end: StarDate
    planetName: string
}

export type ShipTask = "idle" | "traveling" | "harvesting" | "terraforming"

export interface IShipBasic {
    id: ShipID
    type: string
    name: string
    owner: string
    location: IShipLocation
}

// FIXME ship location does not include the planet name, but ship heading to/from does...
export interface IShip extends IShipBasic {
    crew: number
    value: number
    cargo: IResources
    passengers: number
    fuels: number
    // Static data
    requiresFuel: boolean
    requiredCrew: number
    capacity: IShipCapacity
    speed: number
    range: number
    heading?: IShipHeading
    harvester?: IShipHarvesting
    task: ShipTask
    equipment?: IShipHarvester | IShipTerraformer
}

export interface IPlatoonLocation {
    planet?: PlanetID
    ship?: ShipID
}

export enum PlatoonStatus {
    None,
    Training,
    Recruited,
    Defeated,
}

export interface IPlatoonBasic {
    id: PlatoonID
    name: string
    owner: string
    status: PlatoonStatus
    location: IPlatoonLocation
    strength: number
}

export interface IPlatoon extends IPlatoonBasic {
    troops: number
    suit: string
    weapon: string
    calibre: number
    aggression: number
    rank: string
}

export interface ISolarSystem {
    difficulty: Difficulty
    date: StarDate
}

export interface IUniverse extends ISolarSystem {
    planets: (IPlanetBasic | IPlanet)[]
    ships: (IShipBasic | IShip)[]
    platoons: (IPlatoonBasic | IPlatoon)[]
    espionage?: IEspionageReport
}

export interface IEquipment {
    type: string
    name: string
    power: number
    cost: number
}

export interface IEquipmentList {
    [key: string]: IEquipment
}

export interface IEspionageReport extends Partial<IResources> {
    date: StarDate
    planet: {
        id: PlanetID
        name: string
    }
    strength?: number
    civilians?: number
}
