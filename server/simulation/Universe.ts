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

    for (let i = 0; i < 6; i++)
    {
      this.planets.push(new Planet(i))
    }
  }

  toJSON()
  {
    return this
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
      this.planets[1].population += 1
      changes.planets.push(1)
    }

    return changes
  }
}
