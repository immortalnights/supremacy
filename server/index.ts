import express from "express"
import { Server } from "socket.io"
import http from "http"
import Player from "./Player"
import ConnectedPlayer from "./ConnectedPlayer"
import Room from "./lobby/Room"
import Game from "./Game"
import type { ServerToClientEvents, ClientToServerEvents, IGameOptions, IPlayer } from "./types"
import Universe from "./simulation/Universe"
import AIPlayer from "./AIPlayer"

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

const players: ConnectedPlayer[] = []
const rooms: Room[] = []
const games: Game<Universe>[] = []

const cleanupRoom = (id: string) => {
  const index = rooms.findIndex((room) => room.id === id)

  if (index !== -1)
  {
    const room = rooms[index]
    if (room.empty())
    {
      room.events.removeAllListeners()

      const removed = rooms.splice(index, 1)[0]
      console.info(`Room ${removed.id} deleted`)
    }
  }
}

const removePlayerFromRoom = (player: ConnectedPlayer) => {
  if (player.room)
  {
    const room = rooms.find((room) => room.id === player.room?.id)

    if (room)
    {
      room.leave(player)
    }
    else
    {
      console.warn(`Failed to find room ${player.room.id} for player ${player.id}`)
    }

    player.room = undefined
  }
}

const removePlayerFromGame = (player: ConnectedPlayer) => {
  if (player.game)
  {
    const game = games.find((game) => game.id === player.game?.id)

    if (game)
    {
      game.leave(player)
    }
    else
    {
      console.warn(`Failed to find game ${player.game.id} for player ${player.id}`)
    }

    player.game = undefined
  }
}

const handleCreateGame = (options: IGameOptions, players: Player[]) => {
  console.log(`Creating new game for ${players.map((p) => p.id).join(", ")}`)
  const game = new Game<Universe>(io, options, players, (opts: IGameOptions) => {
    const u = new Universe()
    u.generate(0) // (opts.seed)

    return u
  })

  games.push(game)

  // Join any AI players
  players.forEach((player) => {
    if (player instanceof AIPlayer)
    {
      game.join(player)
    }
  })

  // Notify the players of the game, so they can join it
  players.forEach((player) => {
    console.log(`Notify ${player.id} of new game`)

    if (player instanceof ConnectedPlayer)
    {
      player.socket.emit("game-created", {
        id: game.id,
        options: game.options,
        saved: game.saved,
        created: game.created,
        players: game.allocatedPlayers.map((p) => ({
          id: player.id,
          name: player.name,
          ready: player.ready,
        })),
        status: game.status,
      })
    }
    else
    {
      // AI Player has already joined
    }
  })
}

// Socket IO
io.on("connection", (socket) => {
  console.log("Client connected", socket.id)
  // Initialize a new Player on a new connection
  const player = new ConnectedPlayer(socket)

  // Listen to Player events
  // player.events.on("player-create-room", playerCreateRoom)
  // player.events.on("player-join-room", playerJoinRoom)

  socket.on("request-rooms", () => {
    socket.emit("room-list", rooms.map((room) => room.toJSON()))
  })

  socket.on("player-create-room", (callback) => {
    if (player.room)
    {
      // Already in a room, cannot create another
      // can sometimes be received on reload/hot reload
      console.log(`Player ${player.id} already in a room ${player.room.id}`)
      player.room.sendRoomDetailsTo(player)
    }
    else
    {
      const room = new Room(io, player)

      room.events.once("room-cleanup", cleanupRoom)
      room.events.once("create-game", handleCreateGame)

      console.log(`Player ${player.id} created room ${room.id}`)

      rooms.push(room)

      player.handleJoinRoom(room)
    }

    callback(!!player.room)
  })

  socket.on("player-join-room", (id, callback) => {
    console.log(`Player ${player.id} attempting to join room ${id}`)

    const room = rooms.find((room) => room.id === id)
    if (room && room.players.length < room.slots)
    {
      room.join(player)
      player.handleJoinRoom(room)
    }

    callback(!!player.room)
  })

  socket.on("player-join-game", (id, callback) => {
    console.log(`Player ${player.id} attempting to join game ${id}`)

    const game = games.find((game) => game.id === id)
    if (game && game.canJoin(player))
    {
      game.join(player)
      player.handleJoinGame(game)

      // If the game has all the players, start
      game.start()
    }
    else
    {
      console.warn(`Player ${player.id} cannot join game ${game?.id}`)
    }

    callback(!!player.game)
  })

  socket.on("connect_error", () => {
    console.log("Connection error", socket.id)
  })

  // Clean up the player on disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id)
    // Remove the player from any room
    removePlayerFromRoom(player)
    removePlayerFromGame(player)

    // Remove the player entirely
    const index = players.indexOf(player)
    players.splice(index, 1)

    // Stop listening to the player
    player.events.removeAllListeners()
  })

  // Remember the player
  players.push(player)
})

// simulation
setInterval(() => {
  games.forEach((game) => {
    game.simulate()
  })
}, 250)

// debug output
setInterval(() => {
  console.log(`${players.length} players connected, ${rooms.length} rooms, ${games.length} games`)

  rooms.forEach((room) => {
    console.log(`  Room ${room.id} has ${room.players.length} players`)
  })

  games.forEach((game) => {
    console.log(`  Game ${game.id} has ${game.allocatedPlayers.length} players (${game.players.length} ready)`)
  })

}, 5000)

let port = 3010
server.listen(port, () => {
  console.log(`Server online (${port})...`)
})