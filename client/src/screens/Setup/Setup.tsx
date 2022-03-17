import React, { useContext, useEffect } from "react"
import Recoil from "recoil"
import { Box, Link, Button, Grid, Typography, TextField, CardContent, CardActions, Stack, Hidden } from "@mui/material"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { AGame } from "../../data/Game"
import { useLocalStorage } from "../../data/localStorage"
import { IOContext } from "../../data/IOContext"
import wrapPromise from "../../wrapPromise"
import { Player as PlayerData, ClientPlayer } from "../../data/Player"
import { Room as RoomData } from "../../data/Room"

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
        <TextField disabled variant="standard" size="small" value={name || id} />
      </Typography>
    </CardContent>
  )
}

const SlotControls = ({ roomID, isOccupied, isHost, isLocal}: { roomID: string, isOccupied: boolean, isHost: boolean, isLocal: boolean }) => {
  console.log(roomID, isOccupied, isLocal, isHost, (isHost && !isLocal))
  const { } = useContext(IOContext)

  const handleClickInvite = () => {
    // FIXME to use proper Location
    navigator.clipboard.writeText(`http://localhost:3000/setup/${roomID}`)
  }

  const handleClickKick = () => {

  }

  const handleClickAddAI = () => {

  }

  return (
    <CardActions sx={{ visibility: isHost && !isLocal ? "block" : "hidden" }}>
      <Button size="small" disabled={isOccupied} onClick={handleClickInvite}>Invite</Button>
      <Button size="small" disabled={!isOccupied} onClick={handleClickKick}>Kick</Button>
      <Button size="small" disabled={isOccupied} onClick={handleClickAddAI}>Add AI</Button>
    </CardActions>
  )
}

const Room = () => {
  const [ seed, setSeed ] = React.useState(randomSeedString(7))
  const roomData = Recoil.useRecoilValue(RoomData)
  const localPlayer = Recoil.useRecoilValue(PlayerData)
  const { playerToggleReady } = React.useContext(IOContext)
  const navigate = useNavigate()

  const handleChangeSeed = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeed(event.target.value)
  }

  const handleReadyClick = () => {
    if (roomData)
    {
      playerToggleReady()
    }
  }

  const handleLeaveRoomClick = () => {
    // Don't need to send the leave message as the "deconstruction" for
    // the current screen will do so.
    navigate("/")
  }

  let content
  // FIXME - should be handled by Suspense
  if (roomData)
  {
    const isHost = roomData.host === localPlayer.id

    const slots = roomData.players.map((player) => (
      <Box key={player.id}>
        <Slot index={1} id={player.id} name={player.name} ready={player.ready} />
        <SlotControls roomID={roomData.id} isOccupied={true} isLocal={player.id === localPlayer.id} isHost={isHost} />
      </Box>
    ))

    if (roomData.slots - roomData.players.length > 0)
    {
      for (let index = roomData.players.length; index < roomData.slots; index++)
      {
        slots.push(
          <Box key={index}>
            <Slot index={1} id="" name="" ready={false} />
            <SlotControls roomID={roomData.id} isOccupied={false} isLocal={false} isHost={isHost} />
          </Box>
        )
      }
    }

    content = (
      <Grid container>
        <Grid item xs={3} />
        <Grid item xs={6}>
          <Box textAlign="center" width="80%" margin="auto">
            <Typography component="h2">Create Game </Typography>
            <Typography component="p"><small>({roomData?.id})</small></Typography>
            <div>
              Seed #<TextField error={!seed} disabled={!isHost} variant="standard" size="small" value={seed} onChange={handleChangeSeed} />
            </div>
          </Box>
          <Stack direction="row" spacing={2} alignContent="center" alignItems="center" justifyContent="center">
            {slots}
          </Stack>
          <Stack alignContent="center" alignItems="center" justifyContent="center" spacing={2}>
            <Button size="large" variant="contained" color={localPlayer.ready ? "error" : "success"} onClick={handleReadyClick}>{localPlayer.ready ? "Not Ready" : "Ready"}</Button>
            <Button size="small" variant="text" color="inherit" onClick={handleLeaveRoomClick}>Leave</Button>
          </Stack>
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
      console.log("Leave room (cleanup effect)")
      leaveRoom()
    }
  }, [])

  return (
    <React.Suspense fallback={"Loading..."}>
      <RoomWrapper />
    </React.Suspense>
  )
}

export default Setup