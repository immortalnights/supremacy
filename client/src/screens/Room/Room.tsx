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
  Stack,
  CircularProgress,
  CircularProgressProps,
} from "@mui/material"
import { IOContext } from "../../data/IOContext"
import { Room as RoomData, IRoom } from "../../data/Room"
import { RoomStatus } from "../../types"
import { Player as PlayerData, ILocalPlayer } from "../../data/Player"

const CircularProgressWithLabel = (props: CircularProgressProps & { value: number }) => {
  const COUNTDOWN_DURATION = 3

  const progressValue = (100 / COUNTDOWN_DURATION) * props.value
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...{ ...props, value: progressValue }} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
        >{`${Math.round(props.value)}`}</Typography>
      </Box>
    </Box>
  )
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

const ReadyStatus = ({ localPlayer, status, countdown }: { localPlayer: ILocalPlayer, status: RoomStatus, countdown: number }) => {
  const { playerToggleReady } = React.useContext(IOContext)

  const handleReadyClick = () => {
    playerToggleReady()
  }

  let content
  switch (status)
  {
    case RoomStatus.Setup:
    {
      content = (
        <Button size="large" variant="contained" color={localPlayer.ready ? "error" : "success"} onClick={handleReadyClick}>{localPlayer.ready ? "Not Ready" : "Ready"}</Button>
      )
      break
    }
    case RoomStatus.Starting:
    {
      content = (
        <Button variant="text" onClick={handleReadyClick}><CircularProgressWithLabel variant="determinate" value={countdown} /></Button>
      )
      break
    }
    // case RoomStatus.Playing:
    // {
    //   content = (<Navigate to="/game/123" replace />)
    //   break
    // }
    default:
    {
      // Other status should not be handled here
      content = (<>Error</>)
      break
    }
  }

  return content
}

const Room = ({ data }: { data: IRoom }) => {
  const [ seed, setSeed ] = React.useState(data.options.seed)
  const localPlayer = Recoil.useRecoilValue(PlayerData)

  const handleChangeSeed = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeed(event.target.value)
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
          <ReadyStatus localPlayer={localPlayer} status={data.status} countdown={data.countdown} />
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