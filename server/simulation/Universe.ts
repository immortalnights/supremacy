import crypto from "crypto"
import Planet from "./Planet"
import { PlanetType, IPlanetBasic, IPlanet, IChanges, IUpdate } from "./types"
import { IWorld, IConnectedPlayer } from "../serverTypes"


class AI
{
  id: string

  constructor()
  {
    this.id = crypto.randomUUID()
  }
}

export default class Universe implements IWorld
{
  id: string
  players: string[]
  planets: Planet[]
  ships: []
  platoons: []
  created: number
  saved: number
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
    this.saved = 0
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

  // addAI()
  // {
  //   this.ai = new AI()
  //   this.join(this.ai.id)
  // }

  // inProgress()
  // {
  //   return this.players.length === 2
  // }

  // join(id: string)
  // {
  //   let joined = false
  //   if (this.players.length < 2)
  //   {
  //     this.players.push(id)
  //     joined = true

  //     // All capital planets are called Starbase!
  //     if (this.players.length === 1)
  //     {
  //       this.planets[0].claim(id, "Starbase!")
  //     }
  //     else if (this.players.length === 2)
  //     {
  //       this.planets[this.planets.length - 1].claim(id, "Starbase!")
  //     }
  //   }

  //   return joined
  // }

  simulate(delta: number): void
  {
    const changes: IChanges = {
      planets: [],
      ships: [],
      platoons: [],
    }

    // console.log("Universe:tick")
    this.planets.forEach((planet) => {
      if (planet.simulate(delta))
      {
        // changes.planets.push(planet.id)
      }
    })
  }

  sendUpdates(players: IConnectedPlayer[]): void
  {

    // Send each player the entire game data
    players.forEach((player) => {
      this.sendUpdateTo(player)
    })
  }

  sendUpdateTo(player: IConnectedPlayer)
  {
    const update: IUpdate = {
      id: this.id,
      lastSave: this.saved,
      created: this.created,
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
      else if (planet.owner === player.id)
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

      update.planets.push(planetData)
    })

    // TODO ships

    // TODO platoons

    // Send
    player.socket.emit("game-update", update)
  }
}
