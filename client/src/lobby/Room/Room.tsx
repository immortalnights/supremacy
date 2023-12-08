import React from "react"
import Recoil from "recoil"
import {
    useNavigate,
    useParams,
    Link as RouterLink,
    Navigate,
} from "react-router-dom"
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
import { IRoom, Room as RoomData } from "../../data/Room"
import { IGame, Game as GameData } from "../../data/Game"
import { RoomStatus } from "../../types"
import { Player as PlayerData, IPlayer, ILocalPlayer } from "../../data/Player"
import { RoomID } from "@server/types"

const CircularProgressWithLabel = (
    props: CircularProgressProps & { value: number }
) => {
    const COUNTDOWN_DURATION = 3

    const progressValue = (100 / COUNTDOWN_DURATION) * props.value
    return (
        <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
                variant="determinate"
                {...{ ...props, value: progressValue }}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
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

const Slot = ({
    index,
    id,
    name,
    ready,
}: {
    index: number
    id: string
    name: string
    ready: boolean
}) => {
    console.log("SLOT", index, id, name)

    return (
        <CardContent>
            <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
            >
                Player {index} {ready ? "R" : ""}
            </Typography>
            <Typography variant="h5" component="div">
                <TextField
                    disabled
                    variant="standard"
                    size="small"
                    value={name || id}
                />
            </Typography>
        </CardContent>
    )
}

const SlotControls = ({
    roomID,
    hasStarted,
    isOccupied,
    isHost,
    isLocal,
}: {
    roomID: string
    hasStarted: boolean
    isOccupied: boolean
    isHost: boolean
    isLocal: boolean
}) => {
    // console.log("Slot controls for", roomID, isOccupied, isLocal, isHost, (isHost && !isLocal))
    const { roomAction } = React.useContext(IOContext)

    const handleClickInvite = () => {
        // FIXME to use proper Location
        navigator.clipboard.writeText(`http://localhost:3000/room/${roomID}`)
    }

    const handleClickKick = () => {
        // roomAction("kick-player", { who? })
    }

    const handleClickAddAI = () => {
        console.log("Click add ai")
        roomAction("add-ai-player", {})
    }

    return (
        <CardActions
            sx={{ visibility: isHost && !isLocal ? "block" : "hidden" }}
        >
            <Button
                size="small"
                disabled={isOccupied}
                onClick={handleClickInvite}
            >
                Invite
            </Button>
            <Button
                size="small"
                disabled={!hasStarted && !isOccupied}
                onClick={handleClickKick}
            >
                Kick
            </Button>
            <Button
                size="small"
                disabled={isOccupied}
                onClick={handleClickAddAI}
            >
                Add AI
            </Button>
        </CardActions>
    )
}

const ReadyStatus = ({
    localPlayer,
    status,
    countdown,
}: {
    localPlayer: ILocalPlayer
    status: RoomStatus
    countdown: number
}) => {
    const { roomAction } = React.useContext(IOContext)

    const handleReadyClick = () => {
        roomAction("toggle-ready", {})
    }

    let content
    switch (status) {
        case RoomStatus.Setup: {
            content = (
                <Button
                    size="large"
                    variant="contained"
                    color={localPlayer.ready ? "error" : "success"}
                    onClick={handleReadyClick}
                >
                    {localPlayer.ready ? "Not Ready" : "Ready"}
                </Button>
            )
            break
        }
        case RoomStatus.Starting: {
            content = (
                <Button variant="text" onClick={handleReadyClick}>
                    <CircularProgressWithLabel
                        variant="determinate"
                        value={countdown}
                    />
                </Button>
            )
            break
        }
        // case RoomStatus.Closed:
        // {
        //
        // }
        default: {
            // Other status should not be handled here
            content = <>Error (unhandled room status)</>
            break
        }
    }

    return content
}

const Slots = ({
    id,
    players,
    count,
    localPlayer,
    isHost,
}: {
    id: RoomID
    players: IPlayer[]
    count: number
    localPlayer: ILocalPlayer
    isHost: boolean
}) => {
    const slots = players.map((player, index) => (
        <Box key={player.id}>
            <Slot
                index={index + 1}
                id={player.id}
                name={player.name}
                ready={player.ready}
            />
            <SlotControls
                roomID={id}
                hasStarted={false}
                isOccupied={true}
                isLocal={player.id === localPlayer.id}
                isHost={isHost}
            />
        </Box>
    ))

    if (count - players.length > 0) {
        for (let index = players.length; index < count; index++) {
            slots.push(
                <Box key={index}>
                    <Slot index={index + 1} id="" name="" ready={false} />
                    <SlotControls
                        roomID={id}
                        hasStarted={false}
                        isOccupied={false}
                        isLocal={false}
                        isHost={isHost}
                    />
                </Box>
            )
        }
    }

    return <>{slots}</>
}

const Room = ({ data }: { data: IRoom }) => {
    const { leaveRoom } = React.useContext(IOContext)
    const [seed, setSeed] = React.useState(data.options.seed)
    const localPlayer = Recoil.useRecoilValue(PlayerData)

    const handleChangeSeed = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSeed(event.target.value)
    }

    const isHost = data.host === localPlayer.id

    const handleClickLeaveRoom = () => {
        leaveRoom()
    }

    return (
        <Grid container>
            <Grid item xs={3} />
            <Grid item xs={6}>
                <Box textAlign="center" width="80%" margin="auto">
                    <Typography component="h2">Create Game </Typography>
                    <Typography component="p">
                        <small>({data?.id})</small>
                    </Typography>
                    <div>
                        Seed #
                        <TextField
                            error={!seed}
                            disabled={!isHost}
                            variant="standard"
                            size="small"
                            value={seed}
                            onChange={handleChangeSeed}
                        />
                    </div>
                </Box>
                <Stack
                    direction="row"
                    spacing={2}
                    alignContent="center"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Slots
                        id={data.id}
                        count={data.slots}
                        players={data.players}
                        localPlayer={localPlayer}
                        isHost={isHost}
                    />
                </Stack>
                <Stack
                    alignContent="center"
                    alignItems="center"
                    justifyContent="center"
                    spacing={2}
                >
                    <ReadyStatus
                        localPlayer={localPlayer}
                        status={data.status}
                        countdown={data.countdown}
                    />
                    <Link
                        to="/"
                        component={RouterLink}
                        onClick={handleClickLeaveRoom}
                    >
                        Leave
                    </Link>
                </Stack>
            </Grid>
            <Grid item xs={3} />
        </Grid>
    )
}

const RoomLoader = () => {
    console.debug("Render RoomLoader")
    const room = Recoil.useRecoilValue(RoomData)
    const game = Recoil.useRecoilValue(GameData)
    const { joinRoom } = React.useContext(IOContext)
    const navigate = useNavigate()
    const params = useParams()

    const asyncJoinRoom = async (id: string) => {
        try {
            console.log("Joining room", id)
            await joinRoom(id)
        } catch (err) {
            console.warn(`Failed to join room ${id}`)
            navigate("/", { replace: true })
        }
    }

    React.useEffect(() => {
        if (params.id) {
            asyncJoinRoom(params.id)
        }
    }, [])

    // Navigate to the game when game data is received
    let content
    if (game) {
        content = <Navigate to={`/game/${game.id}/`} replace />
    } else if (room) {
        if (room.status === RoomStatus.Closed) {
            content = <>...</>
        } else {
            content = <Room data={room} />
        }
    } else {
        if (params.id) {
            content = <>Joining room...</>
        } else {
            content = <Navigate to="/" replace />
        }
    }

    return content
}

export default RoomLoader
