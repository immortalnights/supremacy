import express from "express"
import crypto from "crypto"
import { Server } from "socket.io"
import http from "http"
import { simulate, createUniverse, findUniverse } from "./simulation/index"
import { IPlanet } from "./simulation/types"
import Universe from "./simulation/Universe"
import Planet from "./simulation/Planet"

// temp single universe
let u: Universe = new Universe()
u.generate(0)
u.addAI()
u.join("player_1")

const app = express()

const server = http.createServer(app)
const socket = new Server(server, {
  path: "/socket-io/",
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

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

  // use existing player id, or create a new player id
  const playerId = req.body.playerId || crypto.randomUUID()

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

  // AI, if applicable must join first
  universe.join(playerId)

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

router.get("/planets", (req, res) => {
  const playerId = req.headers["x-player-id"] as string
  const gameId = (req.headers["x-game-id"] || "") as string

  const universe = findUniverse(gameId)

  let planets: Planet[] = []
  if (universe)
  {
    planets = [ ...universe.planets ]

    // Rename the enemy starbase to ensure it's distinct
    if (planets[0].owner !== playerId && planets[0].name === "Starbase!")
    {
      planets[0] = planets[0].clone()
      planets[0].name = "Enemybase"
    }
  }

  res.json({
    ok: !!universe,
    planets: planets
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

// Socket IO
socket.on("connection", (socket: any) => {
  console.log("ws connected")

  const timer = setInterval(() => {
    u.simulate(0)

    let data: IPlanet[] = []
    u.planets.forEach((planet) => {
      data.push(planet.toJSON())
    })
    socket.emit("planets", data)
  }, 1000)

  socket.on("connect", () => {
    console.log("client connected")
  })
  socket.on("disconnect", () => {
    console.log("client disconnected")
    clearInterval(timer)
  })
})


simulate();

let port = 3010
server.listen(port, () => {
  console.log(`Server online (${port})...`)
})