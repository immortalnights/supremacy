import { sim } from "./sim"

export class Planet
{
  // id: number
  // population: number

  constructor(id)
  {
    console.log("Planet:constructor")
    this.id = id
    this.population = 0
  }
}

export class Universe
{
  // id: number
  // planets: Planet[]
  // game: object

  constructor()
  {
    console.log("Universe:constructor")
    this.id = Math.floor(Math.random() * 100)
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

    for (let i = 0; i < 6; i++)
    {
      this.planets.push(new Planet(i))
    }
  }

  toJSON()
  {
    return this
  }

  simulate(delta)
  {
    console.log("Universe:tick")
    this.planets[1].population += 1
  }
}

let u = null

const simulate = () => {
  const FPS = 1

  // initialize the Universe (within this context)
  u = new Universe()
  let time = Date.now()

  setInterval(() => {
    const now = Date.now()
    u.simulate(now - time)
    time = now

    postMessage({
      type: "UPDATE",
      data: u
    })
  }, 1000 / FPS)

  postMessage({
    type: "INITIALIZE",
    data: u
  })
}

onmessage = (e) => {
  const msg = e.data

  switch (msg.type)
  {
    case "START":
    {
      simulate()
      break
    }
  }
}

export default simulate
