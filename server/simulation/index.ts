import Universe from "./Universe"
import Planet from "./Planet"
import fs from "fs"
// import { IChanges } from "./types.ts"

let simulateTimeout: NodeJS.Timeout | null = null
const cache: { [key: string]: Universe } = {}

export const simulate = () => {
  const FPS = 2

  let time = Date.now()

  simulateTimeout = setInterval(() => {
    const now = Date.now()

    for (const [ key, uni ] of Object.entries(cache))
    {
      uni.simulate(now - time)

      if (false === uni.finished)
      {
        fs.writeFileSync(`./saved_games/${uni.id}.sav`, JSON.stringify(uni.toJSON()))
        uni.saved = now
        // console.log(`Saved Universe ${uni.id}`)
      }
    }

    time = now
  }, 1000 / FPS)
}

export const shutdown = () => {
  clearInterval(simulateTimeout as NodeJS.Timeout)
}

export const createUniverse = (options: {}) => {
  const universe = new Universe()
  cache[universe.id] = universe
  return universe
}

export const findUniverse = (id: string): Universe | undefined => {
  return cache[id]
}

// const dispatch = (msg: IMessage) => {
//   console.log("Received", msg)
//   switch (msg.type)
//   {
//     case "LOAD":
//     {
//       console.debug("Parsing save game data", msg.data)
//       universe = new Universe()
//       // Assign save game data to the Universe class
//       Object.assign(universe, msg.data)
//       // Map planets as Planet instances
//       universe.planets.map(p => {
//         const planet = new Planet(p.id)
//         Object.assign(planet, p)
//         return planet
//       })

//       startUniverse()
//       break
//     }
//     case "CREATE":
//     {
//       // create
//       universe = new Universe()

//       startUniverse()
//       break
//     }
//     case "START":
//     {
//       simulate()
//       break
//     }
//     case "QUIT":
//     {
//       clearInterval(simulateTimeout as number)
//       console.log("Simulation stopped")
//       break
//     }
//     default:
//     {
//       console.error(`Received unhandled message '${msg.type}'`)
//       break
//     }
//   }
// }
