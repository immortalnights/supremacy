import { atom, selectorFamily } from 'recoil'
import equipmentData from '../data/equipment.json'

const filterEquipment = type => {
	const equipment = []
	Object.keys(equipmentData).forEach(key => {
		const e = equipmentData[key]
		if (e.type === type)
		{
			e.id = key
			equipment.push(e)
		}
	})

	return equipment
}

export const suits = atom({
	key: 'suits',
	default: filterEquipment('suit')
})

export const weapons = atom({
	key: 'weapons',
	default: filterEquipment('weapon')
})

export const selectSuit = selectorFamily({
	key: 'selectSuit',
	get: key => ({ get }) => {
		const available = get(suits)
		return available.find(s => s.id === key)
	}
})

export const selectWeapon = selectorFamily({
	key: 'selectWeapon',
	get: key => ({ get }) => {
		const available = get(weapons)
		return available.find(w => w.id === key)
	}
})
