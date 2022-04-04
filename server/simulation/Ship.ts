import { IResources, IShip, IShipDetails } from "./types";

export default class Ship implements IShip
{
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
  // Static
  requiredCrew: number
  requiresFuel: boolean
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

  constructor(id: number, name: string, details: IShipDetails, owner: string, location: number)
  {
    this.id = id
    this.name = name
    this.owner = owner
    this.crew = 0
    this.location = {
      planet: location,
      position: "docking-bay"
    }
    this.cargo = {
      food: 0,
      minerals: 0,
      fuels: 0,
      energy: 0,
    }
    this.passengers = 0

    this.requiresFuel = details.capacity.fuels !== null
    this.requiredCrew = details.requiredCrew
    this.capacity = { ...details.capacity }
    this.speed = details.speed
    this.range = details.range
    this.value = details.value
    this.harvester = {
      location: details.harvester.location,
      resources: { ...details.harvester.resources },
    }
  }

  load(data: Ship)
  {
    Object.assign(this, data)
  }

  toJSON()
  {
    return this
  }

  // clone()
  // {
  //   const other = new Ship("", {}, "", 0)
  //   Object.assign(other, this)
  //   return other
  // }
}