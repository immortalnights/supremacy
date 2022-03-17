
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

export interface IPlanet {
  id: number
  owner?: string
  name: string
  habitable: boolean
  type: PlanetType
  radius: number
  population: number
  terraforming: boolean
  terraformDuration: number

  growth: number
  growthChange: number
  morale: number
  tax: number
  status: string
  location: number // ?
  resources: IResources
  multipliers: boolean
}

export interface IShip {

}

export interface IPlatoon {

}

export interface IUniverse {
  id: string
  players: string[]
  planets: IPlanet[]
  ships: IShip[]
  platoons: IPlatoon[]
  created: number
  saved: number | null
  finished: boolean
  nextShipId: number
}

export interface IChanges {
  planets: number[]
  ships: []
  platoons: []
}
