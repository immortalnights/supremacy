import { IResources, IShipCapacity } from "./types"

export interface IStaticShipHarvesting {
  location: string
  resources: IResources
}

export interface IStaticShipDetails {
  type: string
  description: string
  shortName: string
  requiredCrew: number
  capacity: IShipCapacity
  speed: number
  range: number
  cost: {
    credits: number
    minerals: number
    energy: number
  }
  value: number
  limit?: number
  harvester: IStaticShipHarvesting | null
}


export interface IShipList {
  [key: string]: IStaticShipDetails
}
