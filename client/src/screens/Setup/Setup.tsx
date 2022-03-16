import React, { useEffect } from "react"
import Recoil from "recoil"
import { Box, Link, Button, Grid, Typography, TextField, CardContent, CardActions, Stack, Hidden } from "@mui/material"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { AGame } from "../../data/Game"
import { useLocalStorage } from "../../data/localStorage"
import { IOContext } from "../../data/IOContext"
import wrapPromise from "../../wrapPromise"
import { IRoom, Room as RoomData, IPlayer, Player as PlayerData } from "../../data/Room"

// New game flow
// xhr to server to create game
// wait for response
  // in the future it would be good to have this over ws and neat "start game" progress
  // server builds universe (typically this is super fast, but separate for future expansion)
  // wait for all players to connect (1 or more as needed)
// response contains game id
// play moves to game screen


const randomSeedString = (length: number) => {
  return (Math.random() + 1).toString(36).substring(length);
}

const Slot = ({ index, id, name, ready }: { index: number, id: string, name: string, ready: boolean }) => {
  // console.log(index, id, name)

  return (
    <CardContent>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        Player {index} {ready ? "R" : ""}
      </Typography>
      <Typography variant="h5" component="div">
        <TextField disabled variant="standard" size="small" value={name} />
      </Typography>
    </CardContent>
  )
}

const SlotControls = ({ roomID, isOccupied, isHost, isLocal}: { roomID: string, isOccupied: boolean, isHost: boolean, isLocal: boolean }) => {
  // console.log(roomID, isLocal, isHost, (isHost && !isLocal))

  const handleInvite = () => {
    // FIXME to use proper Location
    navigator.clipboard.writeText(`http://localhost:3000/setup/${roomID}`)
  }

  return (
    <CardActions sx={{ visibility: isHost && !isLocal ? "block" : "hidden" }}>
      <Button size="small" disabled={!isOccupied} onClick={handleInvite}>Invite</Button>
      <Button size="small" disabled={isOccupied}>Kick</Button>
      <Button size="small" disabled={!isOccupied}>Add AI</Button>
    </CardActions>
  )
}

const Room = () => {
  const [ seed, setSeed ] = React.useState(randomSeedString(7))
  const roomData = Recoil.useRecoilValue(RoomData)
  const playerData = Recoil.useRecoilValue(PlayerData)
  const { playerToggleReady } = React.useContext(IOContext)

  const handleChangeSeed = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeed(event.target.value)
  }

  const toggleReady = () => {
    if (roomData)
    {
      playerToggleReady()
    }
  }

  let content
  // FIXME - should be handled by Suspense
  if (roomData)
  {
    const localPlayer = roomData.players.find((p) => p.id === playerData.id) as IPlayer

    content = (
      <Grid container>
        <Grid item xs={3} />
        <Grid item xs={6}>
          <Box textAlign="center" width="80%" margin="auto">
            <Typography component="h2">Create Game </Typography>
            <Typography component="p"><small>({roomData?.id})</small></Typography>
            <div>
              Seed #<TextField error={!seed} disabled={!playerData.host} variant="standard" size="small" value={seed} onChange={handleChangeSeed} />
            </div>
          </Box>
          <Stack direction="row" spacing={2} alignContent="center" alignItems="center" justifyContent="center">
            {roomData.players.map((player) => (
              <Box key={player.id}>
                <Slot index={1} id={player.id} name={player.name} ready={player.ready} />
                <SlotControls roomID={roomData.id} isOccupied={!player.id} isLocal={player.local} isHost={playerData.host} />
              </Box>
            ))}
          </Stack>
          <div style={{ textAlign: "center" }}>
            <Button size="large" variant="contained" color={localPlayer.ready ? "error" : "success"} onClick={toggleReady}>{localPlayer.ready ? "Not Ready" : "Ready"}</Button>
          </div>
        </Grid>
        <Grid item xs={3} />
      </Grid>
    )
  }
  else
  {
    content = (<div>Loading...</div>)
  }

  return content
}

const RoomWrapper = () => {
  const { status, createRoom, joinRoom } = React.useContext(IOContext)
  const params = useParams()

  useEffect(() => {
    const connectAndCreateRoom = async () => {
      if (status === "connected")
      {
        if (params.id)
        {
          console.log("attempting to join room")
          joinRoom(params.id)
        }
        else
        {
          console.log("attempting to create room")
          createRoom()
        }
      }
    }

    wrapPromise(connectAndCreateRoom())
  }, [ status ])

  return (<Room />)
}

// TODO change the url when joined a room!

const Setup = () => {
  const { leaveRoom } = React.useContext(IOContext)

  useEffect(() => {
    return () => {
      console.log("destroy room")
      leaveRoom()
    }
  }, [])

  return (
    <React.Suspense fallback={"Loading..."}>
      <RoomWrapper />
    </React.Suspense>
  )
}

// const SetupX = () => {
//   const [ game, setGame ] = Recoil.useRecoilState(AGame)
//   const [ currentGameId, setCurrentGameId ] = useLocalStorage("game")
//   const [ currentPlayerId, setCurrentPlayerId ] = useLocalStorage("player")
//   const params = useParams()
//   const [ searchParams, setSearchParams ] = useSearchParams()
//   const navigate = useNavigate()

//   React.useEffect(() => {
//     let req
//     if (params.id)
//     {
//       req = fetch("/api/join", {
//         method: "put",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           playerId: currentPlayerId,
//           gameId: currentGameId,
//         }),
//       })
//     }
//     else
//     {
//       req = fetch("/api/create", {
//         method: "post",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           playerId: currentPlayerId,
//           multiplayer: Number(searchParams.get("multiplayer")) === 1
//         }),
//       })
//     }

//     req.then((res) => {
//       return res.ok && res.json()
//     }).then((data) => {
//       if (data.ok)
//       {
//         // save the game id in local storage to allow continuing
//         setCurrentGameId(data.universe.id)
//         setCurrentPlayerId(data.playerId)
//         setGame(data.universe)
//       }
//       else
//       {
//         // return to main menu
//         navigate("/")
//       }
//     })


//   }, [])

//   React.useEffect(() => {
//     if (game)
//     {
//       setTimeout(() => {
//         navigate(`/play/${game.id}`, { replace: true })
//       }, 2000)
//     }
//   }, [ game ])

//   let index = game ? 1 : 0

//   return (
//     <div style={{ textAlign: "center" }}>{states[index]}</div>
//   )
// }

export default Setup