export const DAYS_PER_YEAR = 48

export interface IResources {
  credits: number
  food: number
  foodChange: number
  minerals: number
  fuels: number
  energy: number
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

  growth: number
  growthChange: number
  morale: number
  tax: number
  status: string
  resources: IResources
  multipliers: boolean
}

export interface IShip {

}

export interface IPlatoon {

}

export interface IDate {
  day: number
  year: number
}

export interface ISolarSystem {
  date: IDate
  yearDuration: number
}

export interface IUniverse extends ISolarSystem {
  planets: (IPlanetBasic | IPlanet)[]
  ships: IShip[]
  platoons: IPlatoon[]
}

