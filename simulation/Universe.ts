import Planet from "./Planet.js"
import { IChanges } from "./types"

export default class Universe
{
  id: number
  planets: Planet[]
  game: object
  created: number

  constructor()
  {
    console.log("Universe:constructor")
    this.id = Math.floor(Math.random() * 100)
    // this.players = []
    this.planets = []
    this.game = {
      id: 0,
      players: [],
      planets: [],
      nextShipId: 0,
      ships: [],
      platoons: [],
      startDateTime: new Date().toString(),
      finished: false
    }
    this.created = Date.now()

    for (let i = 0; i < 6; i++)
    {
      this.planets.push(new Planet(i))
    }
  }

  toJSON()
  {
    return this
  }

  simulate(delta: number): IChanges
  {
    const changes: IChanges = {
      planets: [],
      ships: [],
      platoons: [],
    }

    // console.log("Universe:tick")
    this.planets[1].population += 1
    changes.planets.push(1)
    return changes
  }
}
