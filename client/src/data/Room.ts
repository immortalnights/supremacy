import Recoil from "recoil"
import { IRoom, RoomStatus } from "../types.d"

export type { IRoom }

export const Room = Recoil.atom<IRoom | undefined>({
    key: "room",
    default: undefined,
})

export const AvailableRooms = Recoil.atom<IRoom[]>({
    key: "availableRooms",
    default: [],
})
