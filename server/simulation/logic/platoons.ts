import { IEquipment, IPlatoon } from "../types"
import EquipmentData from "../data/equipment.json"

const firstOfType = (type: string) => {
  let key = ""

  Object.entries(EquipmentData).forEach(([ index, data ]) => {
    if (data.type === type)
    {
      key = index
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

export const defaultSuit: string = firstOfType("suit")
export const defaultWeapon: string = firstOfType("weapon")

export const calculatePlatoonRecruitmentCost = (platoon: IPlatoon) => {
  const suit = EquipmentData[platoon.suit as keyof typeof EquipmentData] as { "cost": number }
  const weapon = EquipmentData[platoon.equipment as keyof typeof EquipmentData] as { "cost": number }

  return platoon.troops * (suit.cost + weapon.cost)
}

// // taken from https://github.com/dcousens/ordinal.js
export const ordinal = (i: number): string => {
	i = Math.abs(i)
	let suffix = "th"

	let cent = i % 100
	if (cent >= 10 && cent <= 20)
	{
		suffix = "th"
	}
	else
	{
		let dec = i % 10
		if (dec === 1)
		{
			suffix = "st"
		}
		else if (dec === 2)
		{
			suffix = "nd"
		}
		else if (dec === 3)
		{
			suffix = "rd"
		}
	}

	return `${i}${suffix}`
}

// export const calculatePlatoonStrength = (platoon, aggression) => {
// 	const calibrepc = platoon.calibre / 100
// 	const aggressionpc = aggression / 100
// 	// console.log(calibrepc, aggressionpc)

// 	// magic number
// 	const BASE_STRENGTH = 277

// 	// core strength, platoon size percentage (100% = 200) multiplied by calibre percentage of base strength
// 	const core = (platoon.troops / 200) * (BASE_STRENGTH * calibrepc)
// 	// equipment, core multiplied by equipment value
// 	const equipment = core * platoon.unitStrength
// 	// aggression, core multiplied by aggression "step"
// 	const aggr = core * ((aggressionpc / .25) - 1)

// 	// truncate to drop any awkward decimals
// 	const total = Math.trunc(platoon.troops + core + equipment + aggr)
// 	// console.log(platoon.troops, core, equipment, aggr, total)
// 	return total
// }
