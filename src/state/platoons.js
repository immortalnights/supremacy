import { atom, selector, selectorFamily, useRecoilCallback } from 'recoil'
import state from './atoms'
import equipmentData from '../data/equipment.json'

const filterEquipment = type => {
	const equipment = []
	Object.keys(equipmentData).forEach(key => {
		const e = equipmentData[key]
		if (e.type === type)
		{
			equipment.push(e)
		}
	})

	return equipment
}

export const suits = atom({
	key: 'suits',
	default:filterEquipment('suit')
})

export const blueprints = atom({
	key: 'weapons',
	default: filterEquipment('weapon')
})

export const selectPlayerPlatoon = selectorFamily({
	key: 'playerPlatoon',
	get: key => ({ get }) => {
		const game = get(state.game)
		let platoon

		game.platoons.find(id => {
			const p = get(state.platoons(id))
			if (p.owner === key.player && p.name === key.name)
			{
				platoon = p
			}

			return !!platoon
		})

		console.log("playerPlatoon", key, "=>", platoon)
		return platoon
	}
})

const platoonReducer = (platoon, action) => {
	switch (action.type)
	{
		case 'set:suit':
		{
			break
		}
		case 'set:weapon':
		{
			break
		}
		case 'change:size':
		{
			// Add or remove civilians
			break
		}
		case 'commission':
		{
			break
		}
		default:
		{
			break
		}
	}
}
