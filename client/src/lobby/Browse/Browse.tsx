import React from "react"
import Recoil from "recoil"
import { Typography, Link } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"
import { IRoom, AvailableRooms } from "../../data/Room"
import { IOContext } from "../../data/IOContext"

const NoRooms = () => {
  return (<Typography>No rooms</Typography>)
}

const RoomList = ({ rooms }: { rooms: IRoom[] }) => {
  return (
    <ul>
      {rooms.map((room) => (
        <li key={room.id}>{room.options.seed} | {room.players.length} | <Link component={RouterLink} to={`/room/${room.id}`}>Join</Link></li>
      ))}
    </ul>
  )
}

const Browse = () => {
  const rooms = Recoil.useRecoilValue(AvailableRooms)
  const { requestRooms } = React.useContext(IOContext)

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      console.log("eh")
      requestRooms()
    }, 1000)

    requestRooms()

    return () => {
      window.clearInterval(interval)
    }
  }, [ requestRooms ])

  return (
    <>
      <Typography component="h2">Available Rooms</Typography>
      {rooms.length === 0 ? <NoRooms /> : <RoomList rooms={rooms} />}
    </>
  )
}

export default Browse