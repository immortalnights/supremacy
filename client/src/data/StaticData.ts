import Recoil from "recoil"
import { IShipList, IShipDetails } from "../simulation/types.d"

export type { IShipList, IShipDetails }

export const StaticShips = Recoil.atom<IShipList>({
    key: "staticShips",
    default: {},
})

export const StaticEquipment = Recoil.atom<object>({
    key: "staticEquipment",
    default: {},
})