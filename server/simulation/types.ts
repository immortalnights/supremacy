export const DAYS_PER_YEAR = 48

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

export interface IPlanetBasic {
  id: number
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

export interface IShip {
  id: number
  name: string
  owner: string
  crew: number
  value: number
  location: {
    planet: number
    position: string
  }
  cargo: IResources
  passengers: number
  // Static data
  requiresFuel: boolean
  requiredCrew: number
  capacity: {
    civilians: number
    cargo: number
    fuels: number
    platoons: number
  }
  speed: number
  range: number
  harvester: {
    location: string
    resources: IResources
  } | undefined
}

export interface IPlatoon {
  id: number
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
  ships: IShip[]
  platoons: IPlatoon[]
}

export interface IShipDetails {
  type: string
  description: string
  shortName: string
  requiredCrew: number
  capacity: {
    civilians: number
    cargo: number
    fuels: number
    platoons: number
  }
  speed: number
  range: number
  cost: {
    credits: number
    minerals: number
    energy: number
  }
  value: number
  harvester: {
    location: string
    resources: IResources
  }
}

export interface IShipList {
  [key: string]: IShipDetails
}

