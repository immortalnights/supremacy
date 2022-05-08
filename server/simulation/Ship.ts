import e from "express";
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

  totalCargo(): number
  {
    return Object.keys(this.cargo).reduce((prev, value, index) => {
      const key = value as keyof IResources
      return prev + this.cargo[key]
    }, 0)
  }

  addCrew(planet: Planet)
  {
    // console.log(this.requiredCrew, this.crew)
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

  removeCrew(planet: Planet)
  {
    if (this.crew > 0)
    {
      const crew = this.crew
      this.crew = 0
      planet.population += crew
    }

    return this.crew === 0
  }

  modifyCargo(planet: Planet, type: string, value: number)
  {
    const resourceKey = type as keyof IResources
    const cargoKey = type as keyof IResources

    // console.log("*", type, this.capacity && this.capacity.cargo, this.cargo[cargoKey], planet.resources[resourceKey], this.totalCargo(), value)
    if (this.capacity && this.capacity.cargo > 0)
    {
      // Add cargo
      if (value > 0)
      {
        const totalCargo = this.totalCargo()
        if (totalCargo < this.capacity.cargo)
        {
          const change = Math.min(this.capacity.cargo - totalCargo, planet.resources[resourceKey], value)
          this.cargo[cargoKey] += change
          planet.resources[resourceKey] -= change
        }
      }
      // Remove cargo
      else if (value < 0)
      {
        if (this.cargo[cargoKey] > 0)
        {
          const change = Math.min(this.cargo[cargoKey], Math.abs(value))
          this.cargo[cargoKey] -= change
          planet.resources[resourceKey] += change
        }
      }
    }
    // console.log("=", this.capacity && this.capacity.cargo, this.cargo[cargoKey], planet.resources[resourceKey])
  }

  modifyPassengers(planet: Planet, value: number)
  {
    if (this.capacity && this.capacity.civilians > 0)
    {
      // console.log("*", this.capacity.civilians, this.passengers, planet.population, value)
      // Add passengers
      if (value > 0)
      {
        if (this.passengers < this.capacity.civilians)
        {
          const change = Math.min(this.capacity.civilians - this.passengers, planet.population, value)
          this.passengers += change
          planet.population -= change
        }
      }
      // Remove passengers
      else if (value < 0)
      {
        if (this.passengers > 0)
        {
          const change = Math.min(this.passengers, Math.abs(value))
          this.passengers -= change
          planet.population += change
        }
      }
      // console.log("=", this.capacity.civilians, this.passengers, planet.population)
    }
  }

  refuel(planet: Planet, value: number)
  {
    if (this.capacity && this.capacity.fuels > 0)
    {
      // console.log("*", this.capacity.fuels, this.fuels, planet.resources.fuels, value)
      // Add fuels
      if (value > 0)
      {
        if (this.fuels < this.capacity.fuels)
        {
          const change = Math.min(this.capacity.fuels - this.fuels, planet.resources.fuels, value)
          this.fuels += change
          planet.resources.fuels -= change
        }
      }
      // Remove fuels
      else if (value < 0)
      {
        if (this.fuels > 0)
        {
          const change = Math.min(this.fuels, Math.abs(value))
          this.fuels -= change
          planet.resources.fuels += change
        }
      }
      // console.log("=", this.capacity.fuels, this.fuels, planet.resources.fuels)
    }
  }

  emptyCargo(planet: Planet)
  {
    // console.log("*", this.cargo, planet.resources, this.totalCargo())

    Object.keys(this.cargo).forEach((item: string) => {
      const key = item as keyof IResources
      const amount = this.cargo[key]
      this.cargo[key] = 0
      planet.resources[key] += amount
    })

    // console.log("=", this.cargo, planet.resources)
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