import { IEquipment, IPlatoon } from "../types"
import EquipmentData from "../data/equipment.json"

const cheapestOfType = (type: string) => {
    let key = ""
    let cheapest: IEquipment
    Object.entries(EquipmentData).forEach(([index, data]) => {
        if (data.type === type && (!cheapest || data.cost < cheapest.cost)) {
            key = index
            cheapest = data
        }
    })

    return key
}

export const Ranks = {
    0: "Cadet",
    10: "2nd Lieutenant",
    20: "Captain",
    30: "Major",
    40: "Lieutenant Colonel",
    50: "Colonel",
    60: "1 Star General",
    70: "2 Star General",
    80: "3 Star General",
    90: "4 Star General",
    100: "5 Star General",
}

export const MAX_TROOPS = 200
export const MAX_CALIBRE = 100
export const TRAINING_TIME = 120

export const defaultSuit: string = cheapestOfType("suit")
export const defaultWeapon: string = cheapestOfType("weapon")

export const calculatePlatoonRecruitmentCost = (platoon: IPlatoon) => {
    const suit = EquipmentData[platoon.suit as keyof typeof EquipmentData] as {
        cost: number
    }
    const weapon = EquipmentData[
        platoon.weapon as keyof typeof EquipmentData
    ] as { cost: number }

    return platoon.troops * (suit.cost + weapon.cost)
}

// // taken from https://github.com/dcousens/ordinal.js
export const ordinal = (i: number): string => {
    i = Math.abs(i)
    let suffix = "th"

    let cent = i % 100
    if (cent >= 10 && cent <= 20) {
        suffix = "th"
    } else {
        let dec = i % 10
        if (dec === 1) {
            suffix = "st"
        } else if (dec === 2) {
            suffix = "nd"
        } else if (dec === 3) {
            suffix = "rd"
        }
    }

    return `${i}${suffix}`
}
