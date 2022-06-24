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
const PORT = 3010

const server = http.createServer(app)
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  allowUpgrades: true,
  cors: {
    origin: `http://localhost:3000`,
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

app.use(router)

// TODO tidy socket message handling up based on https://socket.io/docs/v4/server-application-structure/

const players: ConnectedPlayer[] = []
const rooms: Room[] = []
const games: Game<Universe>[] = []

const DEV_DELAY = true
const devDelay = (callback: () => void, delay: number) => {
  if (DEV_DELAY) {
    console.log(`DEV: will send response in ${delay / 1000}s`)
  }

  setTimeout(() => {
    callback()
  }, DEV_DELAY ? delay : 0)
}

const cleanupRoom = (room: Room) => {
  if (room.isEmpty())
  {
    const index = rooms.indexOf(room)
    if (index !== -1)
    {
      const removed = rooms.splice(index, 1)[0]
      console.info(`Room ${removed.id} deleted`)
    }
  }
  else
  {
    console.debug(`Room ${room.id} is no longer empty, did not delete`)
  }
}

const cleanupGame = (game: Game<any>) => {
  if (game.empty())
  {
    const index = games.indexOf(game)
    if (index !== -1)
    {
      const removed = games.splice(index, 1)[0]
      console.info(`Game ${removed.id} deleted`)
    }
  }
  else
  {
    console.debug(`Game ${game.id} is no longer empty, did not delete`)
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
    if (player instanceof ConnectedPlayer)
    {
      devDelay(() => {
        console.log(`Sending game ${game.id} to ${player.id}`)
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
      }, 1000)
    }
  })
}

// Socket IO
io.on("connection", (socket) => {
  console.log("Client connected", socket.id, socket.conn.transport.name)
  // Initialize a new Player on a new connection
  const player = new ConnectedPlayer(socket)

  socket.conn.on("upgrade", () => {
    console.log("Socket upgraded", socket.conn.transport.name)
  });

  // Listen to Player events
  const handleLeaveRoom = () => {
    const room = player.room
    if (room)
    {
      player.handleLeaveRoom()
      // Clean up the room later, if it's still empty
      setTimeout(() => cleanupRoom(room), 5000)
    }
    else
    {
      console.debug(`Player ${player.id} is not in a room`)
    }
  }

  const handleLeaveGame = () => {
    const game = player.game
    if (game)
    {
      player.handleLeaveGame()
      // Clean up the game later, if it's still empty
      setTimeout(() => cleanupGame(game), 5000)
    }
    else
    {
      console.debug(`Player ${player.id} is not in a game`)
    }
  }

  socket.on("request-rooms", () => {
    socket.emit("room-list", rooms.map((room) => room.toJSON()))
  })

  socket.on("player-create-room", (callback) => {
    if (player.room)
    {
      player.handleLeaveRoom()
    }

    const room = new Room(io, player)

    room.events.once("create-game", handleCreateGame)

    rooms.push(room)

    console.log(`Player ${player.id} created room ${room.id}`)

    devDelay(() => {
      console.log("Sending...", player.id, room.id)
      // FIXME update callback
      callback(!!room, room)
    }, 1000)
  })

  socket.on("player-join-room", (id, callback) => {
    console.log(`Player ${player.id} attempting to join room ${id}`)

    const room = rooms.find((room) => room.id === id)
    if (!room)
    {
      console.warn("Room does not exist")
    }
    else if (player.room && player.room.id === room.id)
    {
      console.debug("Player is already in room")
      room.sendRoomDetailsTo(player)
    }
    else if (false === room.canJoin())
    {
      console.warn("Cannot join room")
    }
    else if (room.isFull())
    {
      console.warn("Room is full")
    }
    else
    {
      room.join(player)
      player.handleJoinRoom(room)

      room.sendRoomDetailsTo(player)

      console.log("Player joined room")
    }

    callback(!!player.room)
  })

  socket.on("player-leave-room", handleLeaveRoom)

  socket.on("player-join-game", (id, callback) => {
    console.log(`Player ${player.id} attempting to join game ${id}`)

    const game = games.find((game) => game.id === id)
    if (!game)
    {
      console.warn(`Game does not exist`)
    }
    else if (player.game && player.game.id === game.id)
    {
      console.debug("Player is already in game")
      // TODO Send game details to player
    }
    else if (game.isFull())
    {
      console.warn("Game is full")
    }
    else if (false === game.canJoin(player))
    {
      console.warn("Cannot join game")
    }
    else
    {
      player.handleJoinGame(game)
      game.join(player)

      // remove the player from the room they came from
      if (player.room) {
        player.handleLeaveRoom
      }

      // If the game has all the players, start
      game.start()

      console.log("Player joined game")
    }

    callback(!!player.game)
  })

  socket.on("player-leave-game", handleLeaveGame)

  socket.on("connect_error", () => {
    console.log("Connection error", socket.id)
  })

  // Clean up the player on disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id)
    // Remove the player from any room or game
    handleLeaveRoom()
    handleLeaveGame()

    // Remove the player entirely
    const index = players.indexOf(player)
    players.splice(index, 1)

    // Stop listening to the player events
    player.events.removeAllListeners()
    player.socket.removeAllListeners()
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

server.listen(PORT, () => {
  console.log(`Server online (${PORT})...`)
})