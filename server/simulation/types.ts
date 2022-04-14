export const DAYS_PER_YEAR = 48

export type PlayerGameAction = "rename-planet"
  | "transfer-credits"
  | "planet-modify-tax"
  | "purchase-ship"

export enum Difficulty {
  Easy,
  Medium,
  Hard,
  Impossible,
}

export interface IResources {
  food: number
  minerals: number
  fuels: number
  energy: number
}

export interface IPlanetResources extends IResources {
  credits: number
  foodChange: number
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
  radius: number
  location: number // ?
}

export interface IPlanet extends IPlanetBasic {
  habitable: boolean
  population: number
  terraforming: boolean
  terraformDuration: number

  capital: boolean
  growth: number
  growthChange: number
  morale: number
  tax: number
  status: string
  resources: IPlanetResources
  multipliers: boolean
}

export interface IShipLocation {
  planet: PlanetID | undefined
  position: string
  x: number
  y: number
}

export interface IShipBasic {
  id: ShipID
  type: string
  name: string
  owner: string
  location: IShipLocation
}

export interface IShipCapacity {
  civilians: number
  cargo: number
  fuels: number
  platoons: number
}

export interface IShipHeading {
  location: PlanetID
  from: {
    id: PlanetID
    name: string
  }
  to: {
    id: PlanetID
    name: string
  }
  arrival: number
  fuels: number
}

export interface IShipHarvesting {
  location: string
  resources: IResources
}

// FIXME ship location does not include the planet name, but ship heading to/from does...
export interface IShip extends IShipBasic {
  crew: number
  value: number
  cargo: IResources
  passengers: number
  // Static data
  requiresFuel: boolean
  requiredCrew: number
  capacity: IShipCapacity | null
  speed: number
  range: number
  harvester: IShipHarvesting | null
  heading: IShipHeading | null
}

export interface IPlatoon {
  id: PlatoonID
  name: string
}

export interface IDate {
  day: number
  year: number
}

export interface ISolarSystem {
  difficulty: Difficulty
  date: IDate
  yearDuration: number
}

export interface IUniverse extends ISolarSystem {
  planets: (IPlanetBasic | IPlanet)[]
  ships: (IShipBasic | IShip)[]
  platoons: IPlatoon[]
}

export interface IShipDetails {
  type: string
  description: string
  shortName: string
  requiredCrew: number
  capacity: IShipCapacity | null
  speed: number
  range: number
  cost: {
    credits: number
    minerals: number
    energy: number
  }
  value: number
  harvester: IShipHarvesting | null
}

export interface IShipList {
  [key: string]: IShipDetails
}

export interface IEquipment {
  type: string
  name: string
  cost: string
}

export interface IEquipmentList {
  [key: string]: IEquipment
}