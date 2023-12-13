import React from "react"
import Recoil from "recoil"
import { Typography, Link } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"
import { IRoom, AvailableRooms } from "../../data/Room"
import { IOContext } from "../../data/IOContext"

const NoRooms = () => {
    return <Typography>No rooms</Typography>
}

const RoomList = ({ rooms }: { rooms: IRoom[] }) => {
    return (
        <ul>
            {rooms.map((room) => (
                <li key={room.id}>
                    {room.options.seed} | {room.players.length} |{" "}
                    <Link component={RouterLink} to={`/room/${room.id}`}>
                        Join
                    </Link>
                </li>
            ))}
        </ul>
    )
}

const Browse = () => {
    const rooms = Recoil.useRecoilValue(AvailableRooms)
    const { leaveRoom, leaveGame, subscribe, unsubscribe } =
        React.useContext(IOContext)

    React.useEffect(() => {
        // Leave any room or game the player may be in
        // now that they have returned to the room browser
        void leaveRoom()
        void leaveGame()
    }, [leaveRoom, leaveGame])

    // FIXME should not be polling, but should sub for room updates
    React.useEffect(() => {
        void subscribe("rooms")

        return () => {
            void unsubscribe("rooms")
        }
    }, [subscribe, unsubscribe])

    const handleClickLeaveBrowser = () => {
        void unsubscribe("rooms")
    }

    return (
        <>
            <Typography component="h2">Available Rooms</Typography>
            {rooms.length === 0 ? <NoRooms /> : <RoomList rooms={rooms} />}

            <Link
                to="/"
                component={RouterLink}
                onClick={handleClickLeaveBrowser}
            >
                Leave
            </Link>
        </>
    )
}

export default Browse
