import express from "express"
import { Server } from "socket.io"
import http from "http"
import Player from "./Player"
import Room, { createRoom } from "./lobby/Room"
import { ServerToClientEvents, ClientToServerEvents, IPlayer, IRoom, IRoomOptions } from "./types"

const app = express()

const server = http.createServer(app)
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
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

// TODO tidy socket message handling up based on https://socket.io/docs/v4/server-application-structure/

const players: Player[] = []
const rooms: Room[] = []

const playerCreateRoom = (player: IPlayer) => {
  const p = player as Player
  const room = createRoom(io, p)

  room.events.on("room-cleanup", cleanupRoom)

  console.log("Player created room", room.id)
  // FIXME not good form
  rooms.push(room)
  // The event has to use IPlayer (due to circular references)
  p.room = room
}

const playerJoinRoom = (player: IPlayer, id: string) => {
  const room = rooms.find((room) => room.id === id)
  if (room && room.players.length < room.slots)
  {
    const p = player as Player
    room.join(p)
    // The event has to use IPlayer (due to circular references)
    p.room = room
  }
}

const cleanupRoom = (id: string) => {
  const index = rooms.findIndex((room) => room.id === id)

  if (index !== -1)
  {
    const room = rooms[index]
    if (room.empty())
    {
      const removed = rooms.splice(index, 1)[0]
      console.info(`Room ${removed.id} deleted`)
    }

    room.events.removeAllListeners()
  }
}

const removePlayerFromRoom = (player: Player) => {
  if (player.room)
  {
    const room = rooms.find((room) => room.id === player.room?.id)

    if (room)
    {
      room.leave(player)

      if (room.empty())
      {
        const roomIndex = rooms.indexOf(room)
        rooms.splice(roomIndex, 1)
      }
    }
    else
    {
      console.warn(`Failed to find room ${player.room.id} for player ${player.id}`)
    }

    player.room = undefined
  }
}

// Socket IO
io.on("connection", (socket) => {
  console.log("Client connected", socket.id)
  // Initialize a new Player on a new connection
  const player = new Player(socket)

  // Listen to Player events
  player.events.on("player-create-room", playerCreateRoom)
  player.events.on("player-join-room", playerJoinRoom)

  socket.on("connect_error", () => {
    console.log("Connection error", socket.id)
  })

  // Clean up the player on disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id)
    // TODO room the player form any game

    // Remove the player from any room
    removePlayerFromRoom(player)

    // Remove the player entirely
    const index = players.indexOf(player)
    players.splice(index, 1)

    // Stop listening to the player
    player.events.removeAllListeners()
  })

  // Remember the player
  players.push(player)
})

// debug output
setInterval(() => {
  console.log(`${players.length} players connected, ${rooms.length} rooms`)

  rooms.forEach((room) => {
    console.log(`  Room ${room.id} has ${room.players.length} players`)
  })
}, 5000)

let port = 3010
server.listen(port, () => {
  console.log(`Server online (${port})...`)
})