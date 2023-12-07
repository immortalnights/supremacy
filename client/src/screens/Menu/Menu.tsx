import React from "react"
import Recoil from "recoil"
import { Button, CircularProgress, Stack } from "@mui/material"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { IOContext } from "../../data/IOContext"
import { IRoom } from "../../types.d"

const LoadingButton = ({
    onClick,
    children,
}: {
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
    children: React.ReactNode
}) => {
    const [loading, setLoading] = React.useState(false)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setLoading(true)
        onClick && onClick(event)
    }

    return (
        <Button onClick={handleClick} disabled={loading}>
            {loading ? <CircularProgress size="1.5rem" /> : children}
        </Button>
    )
}

const Menu = () => {
    const navigate = useNavigate()
    const { leaveRoom, leaveGame, createRoom } = React.useContext(IOContext)

    React.useEffect(() => {
        // Leave any room or game the player may be in
        // now that they have returned to the main menu
        leaveRoom()
        leaveGame()
    }, [])

    const handleClickNewGame = async () => {
        try {
            const room: IRoom = await createRoom()
            // setRoom(room)
            navigate(`/room/${room.id}`)
        } catch (err) {
            console.error("Failed to create room", err)
        }
    }

    const startingNewGame = false

    return (
        <Stack>
            <Button size="large" to="/setup" component={RouterLink} disabled>
                Continue
            </Button>
            <LoadingButton onClick={handleClickNewGame}>New Game</LoadingButton>
            <Button size="large" to="/browse" component={RouterLink}>
                Join Game
            </Button>
        </Stack>
    )
}

export default Menu
