import { useRecoilValue } from 'recoil'
import { selectSuit, selectWeapon } from '../state/equipment'

export const MAXIMUM_PLATOONS = 24
export const MAXIMUM_PLATOON_SIZE = 200
export const PLATOON_RANKS = {
	0: "Cadet",
	10: "Second Lieutenant",
	20: "Captain",
	30: "Major",
	40: "Lieutenant Colonel",
	50: "Colonel",
	60: "1 Star General",
	70: "2 Star General",
	80: "3 Star General",
	90: "4 Star General",
	100: "5 Star General"
}

// taken from https://github.com/dcousens/ordinal.js
export const ordinal = i => {
	i = Math.abs(i)
	let suffix = 'th'

	let cent = i % 100
	if (cent >= 10 && cent <= 20)
	{
		suffix = 'th'
	}
	else
	{
		let dec = i % 10
		if (dec === 1)
		{
			suffix = 'st'
		}
		else if (dec === 2)
		{
			suffix = 'nd'
		}
		else if (dec === 3)
		{
			suffix = 'rd'
		}
	}

	return i + suffix
}

export const usePlatoonCostCalc = platoon => {
	const suit = useRecoilValue(selectSuit(platoon.suit))
	const weapon = useRecoilValue(selectWeapon(platoon.weapon))

	return (suit.cost + weapon.cost) * platoon.troops
}

export const createPlatoon = (id, player, index, suit, weapon) => {
	return {
		id,
		owner: player.id,
		name: ordinal(index),
		suit,
		weapon,
		troops: 0,
		troopChange: 0,
		rank: PLATOON_RANKS[0],
		calibre: 0,
		commissioned: false
	}
}


