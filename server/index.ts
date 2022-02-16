import express from "express"
import crypto from "crypto"
// import Universe from "../simulation/Universe"
import { Worker } from "worker_threads"
import { IPlanet } from "./simulation/types"
import e from "express"

const games: {
  [key: string]: {
    worker: Worker,
    cache: any,
  }
} = {}

const app = express()

let id: string = ""

app.post("/create", (req, res) => {
  const worker = new Worker("./supremacy/index.js", { argv: [] })
  worker.postMessage({
    type: "CREATE",
  })
  id = crypto.randomUUID()
  games[id] = {
    worker,
    cache: {}
  }

  worker.on("message", (message) => {
    games[id].cache = message.data
  })

  res.send(`Hello World ${id}`)
})

app.get("/universe", (req, res) => {
  // TODO don't send back the universe objects (planets, ships, platoons) as they have their own API
  res.json(games[id].cache)
})

app.get("/planets/:planetId?", (req, res) => {
  // TODO don't send back the universe objects (planets, ships, platoons) as they have their own API
  const planetId = req.params?.planetId
  if (planetId)
  {
    res.json(games[id].cache.planets[planetId])
  }
  else
  {
    res.json(games[id].cache.planets.map((planet: IPlanet) => ({ id: planet.id })))
  }
})

app.get("/ships", (req, res) => {
  // TODO don't send back the universe objects (planets, ships, platoons) as they have their own API
  res.json(games[id].cache)
})

app.get("/platoons", (req, res) => {
  // TODO don't send back the universe objects (planets, ships, platoons) as they have their own API
  res.json(games[id].cache)
})

app.listen(3001, () => {
  console.log("Server online...")
})