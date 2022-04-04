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
        fs.writeFileSync(`./saved_games/${uni.id}.sav`, JSON.stringify(uni.toJSON()), { encoding: "utf8" })
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
  universe.generate(0)
  cache[universe.id] = universe
  return universe
}

export const findUniverse = (id: string): Universe | undefined => {
  if (!cache[id])
  {
    // FIXME validate the id before trying to load a file...
    const saveFilePath = `./saved_games/${id.replace(/\/\\/g, '')}.sav`
    console.log(`Universe ${id} not found, attempt to load`)
    if (fs.existsSync(saveFilePath))
    {
      console.log(`Universe save file exists, loading...`)
      const data = fs.readFileSync(saveFilePath, { encoding: "utf8" })

      const universe = new Universe()
      universe.load(JSON.parse(data))
      console.log(`Loaded Universe ${universe.id}...`)
      cache[id] = universe
    }
  }

  return cache[id]
}