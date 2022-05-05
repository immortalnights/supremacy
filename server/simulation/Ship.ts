import Planet from "./Planet";
import { IResources, IShip, IShipCapacity, IShipDetails, IShipHarvesting, IShipHeading, IShipLocation, PlanetID, ShipID } from "./types";

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
  fuels: number
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
    this.fuels = 0
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

  addCrew(planet: Planet)
  {
    console.log(this.requiredCrew, this.crew)
    if (this.requiredCrew > 0 && this.crew < this.requiredCrew)
    {
      // Cannot partially crew a ship
      const required = this.requiredCrew - this.crew
      if (planet.population >= required)
      {
        planet.population -= required
        this.crew += required
      }
    }

    console.log(this.requiredCrew, this.crew)
    return this.crew === this.requiredCrew
  }

  relocate(planet: PlanetID, position: string)
  {
    console.log(`Relocate ${this.location.planet}.${this.location.position} => ${planet}.${position}`)
    let ok = false
    // Cannot relocate to a different planet, must travel
    if (planet === this.location.planet)
    {
      switch (position)
      {
        case "surface":
        {
          if (this.location.position === "docking-bay")
          {
            this.location.position = "surface"
            ok = true
          }
          break
        }
        case "docking-bay":
        {
          if (this.location.position === "surface" || this.location.position === "orbit")
          {
            this.location.position = "docking-bay"
            ok = true
          }
          break
        }
        case "orbit":
        {
          if (this.location.position === "docking-bay")
          {
            this.location.position = "orbit"
            ok = true
          }
          break
        }
      }
    }

    return ok
  }
}