import Universe from "./Universe.js"
import Planet from "./Planet.js"


let universe: Universe | null = null
let simulateTimeout: number | undefined

const simulate = () => {
  const AUTO_SAVE_TIME = 2 * 60 * 1000
  const FPS = 1

  let time = Date.now()

  simulateTimeout = setInterval(() => {
    const now = Date.now()
    const uni = (universe as Universe)
    const changes = uni.simulate(now - time)
    time = now

    postMessage({
      type: "UPDATE",
      changes: changes,
      data: uni,
    })
  }, 1000 / FPS)
}

const startUniverse = () => {
  console.debug("Starting universe, post initial update")
  postMessage({
    type: "UPDATE",
    changes: undefined,
    data: universe,
  })

  setTimeout(() => {
    console.debug("Starting simulation")
    simulate()
  }, 1)
}

onmessage = (e) => {
  const msg = e.data

  switch (msg.type)
  {
    case "LOAD":
    {
      console.debug("Parsing save game data", msg.data)
      universe = new Universe()
      // Assign save game data to the Universe class
      Object.assign(universe, msg.data)
      // Map planets as Planet instances
      universe.planets.map(p => {
        const planet = new Planet(p.id)
        Object.assign(planet, p)
        return planet
      })

      startUniverse()
      break
    }
    case "CREATE":
    {
      // create
      universe = new Universe()

      startUniverse()
      break
    }
    case "START":
    {
      simulate()
      break
    }
    case "QUIT":
    {
      clearInterval(simulateTimeout)
      console.log("Simulation stopped")
      break
    }
    default:
    {
      console.error(`Received unhandled message '${msg.type}'`)
      break
    }
  }
}

export default simulate
