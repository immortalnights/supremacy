
export interface IPlayer {
  id: number
  ai: boolean
}

export interface IPlanet {
  id: number
  population: number
}

export interface IShip {

}

export interface IPlatoon {

}

export interface IUniverse {
  id: number,
  planets: IPlanet[],
  created: number
}

export interface IChanges {
  planets: number[]
  ships: []
  platoons: []
}
