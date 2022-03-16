import express from "express"
import crypto from "crypto"
import { Server, Socket } from "socket.io"
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
const io = new Server(server, {
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

// TODO tidy up based on https://socket.io/docs/v4/server-application-structure/

const createRoom = (host: Player) => {
  const room = new Room(host)
  rooms.push(room)
  return room
}

class Player {
  id: string
  socket: Socket
  room: Room | undefined
  gameID: string

  constructor(socket: Socket)
  {
    this.id = crypto.randomUUID()
    this.socket = socket
    this.room = undefined
    this.gameID = ""

    socket.on("room-create", () => {
      if (this.room)
      {
        // Already in a room, cannot create another
        // can sometimes be received on reload/hot reload
        console.log("player already in a room")
      }
      else
      {
        const room = createRoom(this)
        console.log("player created room", room.id)
        this.room = room
      }
    })

    socket.on("room-join", (id: string) => {
      console.log("player", this.id, "attempting to join room", id)
      const room = rooms.find((room) => room.id === id)
      if (room)
      {
        room.join(this)
      }
    })

    socket.on("player-toggle-ready", () => {
      console.log("toggle player ready status")
      this.room.toggleReady(this)
    })

    socket.on("room-leave", () => {
      if (this.room)
      {
        this.room.leave(this)
        this.room = undefined
      }
    })

    // socket.on("room-close", () => {
    //   socket.to(this.roomID).emit("room-closed")
    //   socket.leave(this.roomID)
    //   this.roomID = ""
    // })
  }
}

class AIPlayer {
  socket: undefined
}

interface IPlayer {
  id: string
  socket: Socket | undefined
  room: Room | undefined
  ready: boolean
}

class Room {
  id: string
  players: IPlayer[]
  player1: Player | undefined
  player2: Player | AIPlayer | undefined
  game: undefined
  status: string

  constructor(host: Player)
  {
    this.id = crypto.randomUUID()
    this.players = []
    // FIXME convert player1/player2 into the above array as it's just better
    this.player1 = undefined
    this.player2 = undefined
    this.game = undefined
    this.status = "pending"

    this.hostJoined(host)
  }

  hostJoined(player: Player)
  {
    this.player1 = player

    // Join the socket room
    player.socket.join(this.id)

    // Inform the player about the room
    player.socket.emit("room-joined", {
      playerID: player.id,
      roomID: this.id,
      players: [
        {
          id: player.id,
          name: "",
          local: true,
          host: true,
        },
        {
          id: "",
          name: "",
          local: false,
          host: false,
        }
      ]
    })
  }

  join(player: Player)
  {
    this.player2 = player

    // Join the socket room
    player.socket.join(this.id)

    // Inform the new player about the room
    player.socket.emit("room-joined", {
      playerID: player.id,
      roomID: this.id,
      players: [
        {
          id: this.player1?.id,
          name: "",
          local: false,
          host: true,
        },
        {
          id: player.id,
          name: "",
          local: true,
          host: false,
        }
      ],
    })

    // Inform all other players in the room about the new player
    this.player1?.socket.to(this.id).emit("room-player-joined", {
      playerID: player.id
    })
  }

  toggleReady(player: Player)
  {
    // TODO toggle the given players Ready flag and broadcast to all players
    let ready = false

    io.to(this.id).emit("ready-status-changed", {
      playerID: player.id,
      ready,
    })
  }

  leave(player: Player)
  {
    // Remove the player from the Socket room as they don't need the broadcasts
    player.socket.leave(this.id)

    if (player === this.player1)
    {
      // Host left!
      // io.to(this.id).emit("room-host-left", {
      //   playerID: player.id
      // })
      this.player1 = undefined

      // If the host left, kick the other player
      this.player2?.socket?.emit("room-kicked", {})
    }
    else
    {
      // Other player left
      io.to(this.id).emit("room-player-left", {
        playerID: player.id
      })
      this.player2 = undefined
    }
  }

  empty()
  {
    return !!this.player1 && !!this.player2
  }
}


const players: Player[] = []
const rooms: Room[] = []

// Socket IO
io.on("connection", (socket: Socket) => {
  // Initialize a new Player on a new connection
  const player = new Player(socket)

  socket.on("connect_error", () => {
    console.log("connection error")
  })

  // Clean up the player on disconnection
  socket.on("disconnect", () => {
    console.log("client disconnected")
    // clearInterval(timer)
    const index = players.indexOf(player)

    // Find the room the player is in (if any)
    if (player.room)
    {
      const room = rooms.find((room) => room.id === player.room?.id) as Room
      room.leave(player)

      if (room.empty())
      {
        const roomIndex = rooms.indexOf(room)
        rooms.splice(roomIndex, 1)
      }

      player.room = undefined
    }

    players.splice(index, 1)
  })

  players.push(player)
})


simulate();

let port = 3010
server.listen(port, () => {
  console.log(`Server online (${port})...`)
})