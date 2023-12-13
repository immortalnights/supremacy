import Recoil from "recoil"
import { IStaticShipDetails, IShipList } from "@server/simulation/staticTypes"
import { IEquipmentList } from "@server/simulation/types"

export type { IShipList, IStaticShipDetails }

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
        return Object.fromEntries(
            Object.entries(equipment).filter(
                ([_key, value]) => value.type === "suit"
            )
        )
    },
})

export const Weapons = Recoil.selector<IEquipmentList>({
    key: "WeaponSelector",
    get: ({ get }) => {
        const equipment = get(StaticEquipment)
        return Object.fromEntries(
            Object.entries(equipment).filter(
                ([_key, value]) => value.type === "weapon"
            )
        )
    },
})
