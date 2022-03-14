import crypto from "crypto"
import Planet from "./Planet"
import { IChanges } from "./types"

class AI
{
  id: string

  constructor()
  {
    this.id = crypto.randomUUID()
  }
}

export default class Universe
{
  id: string
  players: string[]
  planets: Planet[]
  ships: []
  platoons: []
  created: number
  saved: number | null
  finished: boolean
  nextShipId: number
  ai: AI | null

  constructor()
  {
    console.log("Universe:constructor")
    this.id = crypto.randomUUID()
    // this.players = []
    this.players = []
    this.planets = []
    this.nextShipId = 0
    this.ships = []
    this.platoons = [],
    this.finished = false
    this.saved = null
    this.created = Date.now()
    this.ai = null
  }

  generate(seed: number)
  {
    for (let i = 0; i < 6; i++)
    {
      this.planets.push(new Planet(i))
    }
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

  addAI()
  {
    this.ai = new AI()
    this.join(this.ai.id)
  }

  inProgress()
  {
    return this.players.length === 2
  }

  join(id: string)
  {
    let joined = false
    if (this.players.length < 2)
    {
      this.players.push(id)
      joined = true

      // All capital planets are called Starbase!
      if (this.players.length === 1)
      {
        this.planets[0].claim(id, "Starbase!")
      }
      else if (this.players.length === 2)
      {
        this.planets[this.planets.length - 1].claim(id, "Starbase!")
      }
    }

    return joined
  }

  simulate(delta: number): IChanges
  {
    const changes: IChanges = {
      planets: [],
      ships: [],
      platoons: [],
    }

    if (this.inProgress())
    {
      // console.log("Universe:tick")
      this.planets.forEach((planet) => {
        if (planet.simulate(delta))
        {
          changes.planets.push(planet.id)
        }
      })
    }

    return changes
  }
}
