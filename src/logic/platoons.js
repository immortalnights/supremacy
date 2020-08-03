
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

export const createPlatoon = (id, player, index, suit, weapon) => {
	return {
		id,
		owner: player.id,
		name: ordinal(index),
		suit,
		weapon,
		troops: 0,
		troopChange: 0,
		rank: '',
		calibre: 0,
		commissioned: false
	}
}