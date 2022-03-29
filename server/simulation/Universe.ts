import crypto from "crypto"
import Planet from "./Planet"
import { PlanetType, IPlanetBasic, IPlanet, IUniverse, DAYS_PER_YEAR, IDate } from "./types"
import type { IWorld, IConnectedPlayer } from "../serverTypes"


class AI
{
  id: string

  constructor()
  {
    this.id = crypto.randomUUID()
  }
}

export default class Universe implements IUniverse, IWorld
{
  date: IDate
  // FIXME would be better if this was not a member
  yearDuration: number
  players: string[]
  planets: Planet[]
  ships: []
  platoons: []
  finished: boolean
  nextShipId: number

  constructor()
  {
    console.log("Universe:constructor")
    this.date = { day: 1, year: 3000 }
    this.yearDuration = DAYS_PER_YEAR
    this.players = []
    this.planets = []
    this.ships = []
    this.platoons = [],
    this.finished = false
    this.nextShipId = 0
  }

  generate(seed: number)
  {
    for (let i = 0; i < 6; i++)
    {
      this.planets.push(new Planet(i))
    }
  }

  join(player: string, ai: boolean)
  {
    let ok = false
    if (this.players.length < 2) // Maximum players
    {
      this.players.push(player)

      if (ai)
      {
        // TODO
      }

      // Fist player, starts at the top
      if (this.players.length === 1)
      {
        this.planets[0].claim(player, "Starbase!")
        ok = true
      }
      else if (this.players.length === 2)
      {
        this.planets[this.planets.length - 1].claim(player, "Starbase!")
        ok = true
      }
    }

    return ok
  }

  toJSON()
  {
    return this
  }

  load(data: Universe)
  {
    Object.assign(this, data)

    this.planets = data.planets.map((planet) => {
      const p = new Planet(0)
      p.load(planet)

      return p
    })
  }

  transferOwnership(fromPlayerID: string, toPlayerID: string)
  {
    this.planets.forEach((planet) => {
      if (planet.owner === fromPlayerID)
      {
        planet.owner = toPlayerID
      }
    })
    // this.ships.forEach((ship) => {
    //   if (ship.owner === fromPlayerID)
    //   {
    //     ship.owner = toPlayerID
    //   }
    // })
    // this.platoons.forEach((platoon) => {
    //   if (platoon.owner === fromPlayerID)
    //   {
    //     platoon.owner = toPlayerID
    //   }
    // })

    console.log(`Transferred items from '${fromPlayerID}' to '${toPlayerID}'`)
  }

  simulate(delta: number): void
  {
    // console.log("Universe:tick")
    this.date.day += 1 * delta

    if (this.date.day > this.yearDuration)
    {
      this.date.day = 1
      this.date.year += 1
    }

    this.planets.forEach((planet) => {
      if (planet.simulate(delta))
      {
        // changes.planets.push(planet.id)
      }
    })
  }

  updateFor(id: string): IUniverse
  {
    const universe: IUniverse = {
      // Don't send partial days
      date: { day: Math.floor(this.date.day), year: this.date.year },
      yearDuration: this.yearDuration, // DAYS_PER_YEAR
      planets: [],
      ships: [],
      platoons: [],
    }

    this.planets.forEach((planet) => {
      let planetData: IPlanetBasic | IPlanet = {
        id: planet.id,
        type: planet.type,
        owner: planet.owner,
        name: "",
        radius: planet.radius,
        location: planet.location,
      }

      if (planet.type === PlanetType.Lifeless)
      {
        // No additional data
        planetData.name = "Lifeless"
      }
      else if (planet.owner === id)
      {
        // Send all data
        planetData = {
          ...planet
        }
      }
      else
      {
        // Send limited data
        planetData.name = "Classified"
      }

      universe.planets.push(planetData)
    })

    // TODO ships

    // TODO platoons

    // Return
    return universe
  }
}
