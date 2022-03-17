import express from "express"
import crypto from "crypto"
import { Server, Socket } from "socket.io"
import http from "http"
import { simulate, createUniverse, findUniverse } from "./simulation/index"
import { IPlanet } from "./simulation/types"
import Universe from "./simulation/Universe"
import Planet from "./simulation/Planet"
import { ServerToClientEvents, ClientToServerEvents, IPlayer, IRoom } from "./types"

type SocketIO = Socket<ClientToServerEvents, ServerToClientEvents>

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

// TODO tidy up based on https://socket.io/docs/v4/server-application-structure/

const createRoom = (host: Player) => {
  const room = new Room(host)
  rooms.push(room)
  return room
}


class Player implements IPlayer {
  id: string
  socket: SocketIO
  name: string
  room: Room | undefined
  ready: boolean
  gameID: string

  constructor(socket: SocketIO)
  {
    this.id = crypto.randomUUID()
    this.socket = socket
    this.name = ""
    this.room = undefined
    this.ready = false
    this.gameID = ""

    socket.emit("registered", { id: this.id })

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
        this.room = room
      }
    })

    socket.on("player-ready-toggle", () => {
      if (this.room)
      {
        console.log(`Toggle player ${this.id} ready status ${this.ready}`)

        this.ready = !this.ready

        this.room.toggleReady(this)
      }
      else
      {
        console.warn(`Player ${this.id} is not in a room!`)
      }
    })

    socket.on("room-leave", () => {
      console.log(`(room-leave) Player ${this.id} left room ${this.room?.id}`)
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

class AIPlayer implements IPlayer {
  id: string
  name: string
  room: Room | undefined
  ready: boolean

  constructor()
  {
    this.id = crypto.randomUUID()
    this.name = ""
    this.room = undefined
    this.ready = true
  }

  send(message: string, data: object)
  {

  }
}

class Room implements IRoom {
  id: string
  options: object
  host: string
  slots: number
  players: IPlayer[]
  game: undefined
  status: string

  constructor(host: Player)
  {
    this.id = crypto.randomUUID()
    this.options = {}
    this.host = ""
    this.slots = 2
    this.players = []
    this.game = undefined
    this.status = "pending"

    this.hostJoined(host)
  }

  hostJoined(player: Player)
  {
    this.host = player.id
    this.players.push(player)

    // Join the socket room
    player.socket.join(this.id)

    // Inform the player about the room
    player.socket.emit("room-joined", {
      id: this.id,
      host: this.host,
      slots: this.slots,
      players: this.players.map((player) => {
        const { id, name, ready } = player
        return {
          id,
          name,
          ready,
        }
      })
    })
  }

  join(player: Player)
  {
    this.players.push(player)

    // Join the socket room
    player.socket.join(this.id)

    // Inform the new player about the room
    player.socket.emit("room-joined", {
      id: this.id,
      host: this.host,
      slots: this.slots,
      players: this.players.map((player) => {
        const { id, name, ready } = player
        return {
          id,
          name,
          ready,
        }
      })
    })

    // Inform all other players in the room about the new player
    player.socket.to(this.id).emit("room-player-joined", {
      id: player.id,
      name: player.name,
      ready: false,
    })
  }

  toggleReady(player: Player)
  {
    // console.log(`Broadcast ready state change ${this.id}, ${player.id}, ${player.ready}`)

    // Broadcast to all players (including the one that made the request)
    io.to(this.id).emit("player-ready-status-changed", {
      id: player.id,
      ready: player.ready,
    })
  }

  leave(player: Player)
  {
    // Remove the player from the socket room
    player.socket.leave(this.id)

    if (this.host === player.id)
    {
      console.log(`The host has left the room ${this.id}`)

      // Remove the host from the player list, so they don't get kicked
      const index = this.players.findIndex((p) => p.id === player.id)
      this.players.splice(index, 1)

      // If the host left, kick the other players
      this.players.forEach((player) => {
        if (player instanceof Player)
        {
          player.socket.emit("room-player-kicked")
        }
      })

      // Remove all players from the room
      this.players = []
    }
    else
    {
      console.log(`A player has left the room ${this.id}`)
      // Other player left, breadcast to everyone
      io.to(this.id).emit("room-player-left", {
        id: player.id
      })
    }
  }

  empty()
  {
    return this.players.length === 0
  }
}

const players: Player[] = []
const rooms: Room[] = []

// Socket IO
io.on("connection", (socket) => {
  // Initialize a new Player on a new connection
  const player = new Player(socket)

  // socket.on("connect_error", () => {
  //   console.log("connection error")
  // })

  // Clean up the player on disconnection
  socket.on("disconnect", () => {
    console.log("client disconnected")
    // clearInterval(timer)
    const index = players.indexOf(player)

    // Find the room the player is in (if any)
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