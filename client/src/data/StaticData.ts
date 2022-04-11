import Recoil from "recoil"
import { IShipList, IShipDetails, IEquipment, IEquipmentList } from "../simulation/types.d"
import { filterObject } from "./utilities"

export type { IShipList, IShipDetails }

export const StaticShips = Recoil.atom<IShipList>({
    key: "staticShips",
    default: {},
})

export const StaticEquipment = Recoil.atom<IEquipmentList>({
    key: "staticEquipment",
    default: {},
})

export const Suits = Recoil.selector<IEquipmentList>({
    key: "SuitSelector",
    get: ({ get }) => {
        const equipment = get(StaticEquipment)
        return filterObject<IEquipmentList, IEquipment>(equipment, (item) => item.type === "suit")
    }
})

export const Weapons = Recoil.selector<IEquipmentList>({
    key: "WeaponSelector",
    get: ({ get }) => {
        const equipment = get(StaticEquipment)
        return filterObject<IEquipmentList, IEquipment>(equipment, (item) => item.type === "weapon")
    }
})
