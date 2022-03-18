import React from "react"
import Recoil from "recoil"
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom"
import {
  Box,
  Button,
  Link,
  Grid,
  Typography,
  TextField,
  CardContent,
  CardActions,
  Stack
} from "@mui/material"
import { IOContext } from "../../data/IOContext"
import { IRoom, Room as RoomData } from "../../data/Room"
import { Player as PlayerData, IClientPlayer } from "../../data/Player"

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
  const { } = React.useContext(IOContext)

  const handleClickInvite = () => {
    // FIXME to use proper Location
    navigator.clipboard.writeText(`http://localhost:3000/room/${roomID}`)
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

const Room = ({ data }: { data: IRoom }) => {
  const [ seed, setSeed ] = React.useState(randomSeedString(7))
  const localPlayer = Recoil.useRecoilValue(PlayerData)
  const { playerToggleReady } = React.useContext(IOContext)
  const navigate = useNavigate()

  const handleChangeSeed = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeed(event.target.value)
  }

  const handleReadyClick = () => {
    playerToggleReady()
  }

  const handleLeaveRoomClick = () => {
    // Don't need to send the leave message as the "deconstruction" for
    // the current screen will do so.
    navigate("/")
  }

  const isHost = data.host === localPlayer.id

  const slots = data.players.map((player) => (
    <Box key={player.id}>
      <Slot index={1} id={player.id} name={player.name} ready={player.ready} />
      <SlotControls roomID={data.id} isOccupied={true} isLocal={player.id === localPlayer.id} isHost={isHost} />
    </Box>
  ))

  if (data.slots - data.players.length > 0)
  {
    for (let index = data.players.length; index < data.slots; index++)
    {
      slots.push(
        <Box key={index}>
          <Slot index={1} id="" name="" ready={false} />
          <SlotControls roomID={data.id} isOccupied={false} isLocal={false} isHost={isHost} />
        </Box>
      )
    }
  }

  return (
    <Grid container>
      <Grid item xs={3} />
      <Grid item xs={6}>
        <Box textAlign="center" width="80%" margin="auto">
          <Typography component="h2">Create Game </Typography>
          <Typography component="p"><small>({data?.id})</small></Typography>
          <div>
            Seed #<TextField error={!seed} disabled={!isHost} variant="standard" size="small" value={seed} onChange={handleChangeSeed} />
          </div>
        </Box>
        <Stack direction="row" spacing={2} alignContent="center" alignItems="center" justifyContent="center">
          {slots}
        </Stack>
        <Stack alignContent="center" alignItems="center" justifyContent="center" spacing={2}>
          <Button size="large" variant="contained" color={localPlayer.ready ? "error" : "success"} onClick={handleReadyClick}>{localPlayer.ready ? "Not Ready" : "Ready"}</Button>
          <Link to="/" component={RouterLink}>Leave</Link>
        </Stack>
      </Grid>
      <Grid item xs={3} />
    </Grid>
  )
}

const RoomLoader = () => {
  const room = Recoil.useRecoilValue(RoomData)
  const { joinRoom, leaveRoom } = React.useContext(IOContext)
  const navigate = useNavigate()
  const params = useParams()

  React.useEffect(() => {
    const join = async (id: string) => {
      try
      {
        await joinRoom(id)
      }
      catch (error)
      {
        console.warn(`Failed to join room ${params.id}`)
        navigate("/", { replace: true })
      }
    }

    if (!room)
    {
      if (params.id)
      {
        join(params.id)
      }
      else
      {
        navigate("/", { replace: true })
      }
    }
  }, [ room, params ])

  React.useEffect(() => {
    return () => {
      console.log("Clean up RoomLoader")
      leaveRoom()
    }
  }, [])

  return (room ? <Room data={room} /> : <div>Joining Room...</div>)
}

export default RoomLoader