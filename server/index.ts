import express from "express"
import crypto from "crypto"
import { simulate, createUniverse, findUniverse } from "./simulation/index"
// import Universe from "../simulation/Universe"
import { Worker } from "worker_threads"
import { IPlanet } from "./simulation/types"
import Universe from "./simulation/Universe"

const app = express()

app.use(express.json())

const router = express.Router()

router.use((req, res, next) => {
  console.log(`Time: ${Date.now()}`)
  next()
})

router.get("/", (req, res) => {
  res.json({
    ok: false,
  })
})

router.post("/create", (req, res) => {
  const universe = createUniverse({})

  // create a new player id
  const playerId = crypto.randomUUID()
  universe.join(playerId)

  console.log(`Player ${playerId} has created ${universe.id}`)

  if (req.body.multiplayer)
  {
    console.log(`Universe waiting for other player...`)
  }
  else
  {
    universe.addAI()
    console.log(`AI has joined ${universe.id}`)
  }

  res.json({
    ok: true,
    playerId,
    universe,
  })
})

router.put("/join", (req, res) => {
  let ok = false
  let playerId = req.body.playerId
  let universe: Universe | undefined = findUniverse(req.body.gameId)
  // If the universe has been found, attempt to join it
  if (universe)
  {
    // If the player has an ID, join only if they are already in the game (reconnecting)
    if (playerId)
    {
      if (universe.players.includes(playerId))
      {
        console.log(`Player ${playerId} has reconnected to ${universe.id}`)
        ok = true
      }
    }
    else if (universe.players.length < 2)
    {
      playerId = crypto.randomUUID()
      if (universe.join(playerId))
      {
        console.log(`Player ${playerId} has joined ${universe.id}`)
        ok = true
      }
    }
  }

  if (!ok)
  {
    playerId = undefined
    universe = undefined
  }

  res.json({
    ok,
    playerId,
    universe,
  })
})

router.get("/universe", (req, res) => {
  // TODO don't send back the universe objects (planets, ships, platoons) as they have their own API
  res.json({
    ok: false,
  })
})

router.get("/planets/:planetId?", (req, res) => {
  // TODO don't send back the universe objects (planets, ships, platoons) as they have their own API
  const planetId = req.params?.planetId
  // if (planetId)
  // {
  //   res.json(games[id].cache.planets[planetId])
  // }
  // else
  // {
  //   res.json(games[id].cache.planets.map((planet: IPlanet) => ({ id: planet.id })))
  // }

  res.json({
    ok: false,
  })
})

router.get("/ships", (req, res) => {
  // TODO don't send back the universe objects (planets, ships, platoons) as they have their own API
  // res.json(games[id].cache)
  res.json({
    ok: false,
  })
})

router.get("/platoons", (req, res) => {
  // TODO don't send back the universe objects (planets, ships, platoons) as they have their own API
  res.json({
    ok: false,
  })
  // res.json(games[id].cache)
})

app.use("/api", router)

simulate();

let port = 3010
app.listen(port, () => {
  console.log(`Server online (${port})...`)
})