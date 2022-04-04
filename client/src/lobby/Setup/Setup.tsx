import React from "react"
import Recoil from "recoil"
import { useNavigate, Navigate } from "react-router-dom"
import { IOContext } from "../../data/IOContext"
import { Room as RoomData } from "../../data/Room"

const Setup = () => {
  const { createRoom, leaveRoom } = React.useContext(IOContext)
  const room = Recoil.useRecoilValue(RoomData)
  const navigate = useNavigate()

  React.useEffect(() => {
    const create = async () => {
      try
      {
        await createRoom()
      }
      catch (error)
      {
        console.warn(`Failed to create room`)
        navigate("/", { replace: true })
      }
    }

    if (!room)
    {
      create()
    }
  }, [ room ])

  return (room ? <Navigate to={`/room/${room.id}`} replace /> : <div>Creating Room...</div>)
}

export default Setup