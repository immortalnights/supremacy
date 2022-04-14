import { IResources, IShip, IShipCapacity, IShipDetails, IShipHarvesting, IShipHeading, IShipLocation, ShipID } from "./types";

export default class Ship implements IShip
{
  id: ShipID
  type: string
  name: string
  owner: string
  crew: number
  value: number
  location: IShipLocation
  cargo: IResources
  passengers: number
  // Static
  requiredCrew: number
  requiresFuel: boolean
  capacity: IShipCapacity | null
  speed: number
  range: number
  harvester: IShipHarvesting | null
  heading: IShipHeading | null

  constructor(id: number, name: string, details: IShipDetails, owner: string, location: number | undefined)
  {
    this.id = id
    this.name = name
    this.owner = owner
    this.crew = 0
    this.location = {
      planet: location,
      position: "docking-bay",
      x: 0,
      // FIXME
      y: 0,
    }
    this.cargo = {
      food: 0,
      minerals: 0,
      fuels: 0,
      energy: 0,
    }
    this.passengers = 0
    this.heading = null

    this.type = details.type
    this.requiresFuel = details.capacity !== null && details.capacity.fuels > 0
    this.requiredCrew = details.requiredCrew
    this.capacity = details.capacity && { ...details.capacity }
    this.speed = details.speed
    this.range = details.range
    this.value = details.value
    this.harvester = details.harvester && {
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