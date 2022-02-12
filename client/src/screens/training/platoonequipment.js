import React from 'react'
import { useRecoilValue } from 'recoil'
import Button from '../../components/button'
import { suits, weapons } from '../../state/equipment'
import { useChangeEquipment } from '../../state/platoons'
import { prevIndex, nextIndex } from '../../logic/general'


const PlatoonEquipment = props => {
	const availableSuits = useRecoilValue(suits)
	const availableWeapons = useRecoilValue(weapons)
	const changeEquipment = useChangeEquipment(props.platoon)

	const suitIndex = availableSuits.findIndex(s => s.id === props.platoon.suit)
	const suit = availableSuits[suitIndex]
	const prevSuitIndex = prevIndex(suitIndex, availableSuits.length)
	const nextSuitIndex = nextIndex(suitIndex, availableSuits.length)

	const weaponIndex = availableWeapons.findIndex(s => s.id === props.platoon.weapon)
	const weapon = availableWeapons[weaponIndex]
	const prevWeaponIndex = prevIndex(weaponIndex, availableWeapons.length)
	const nextWeaponIndex = nextIndex(weaponIndex, availableWeapons.length)

	// console.log(props.platoon.suit, suitIndex, prevSuitIndex, nextSuitIndex, availableSuits.length)
	// console.log(props.platoon.weapon, weaponIndex, prevWeaponIndex, nextWeaponIndex, availableWeapons.length)

	const changeSuit = newSuit => {
		changeEquipment(availableSuits[newSuit].id, weapon.id)
	}

	const changeWeapon = newWeapon => {
		changeEquipment(suit.id, availableWeapons[newWeapon].id)
	}

	return (
		<div className="flex-columns">
			<div>
				<div>Suit Cost: {suit.cost}</div>
				<div style={{height: 200}}><img src="" alt="Suit" /></div>
				<div style={{textAlign: 'center'}}>
					<Button onClick={() => changeSuit(prevSuitIndex)}>Previous</Button>
					<Button onClick={() => changeSuit(nextSuitIndex)}>Next</Button>
				</div>
			</div>
			<div>
				<div>Cost: {weapon.cost}</div>
				<div style={{height: 200}}><img src="" alt="Weapon" /></div>
				<div style={{textAlign: 'center'}}>
					<Button onClick={() => changeWeapon(prevWeaponIndex)}>Previous</Button>
					<Button onClick={() => changeWeapon(nextWeaponIndex)}>Next</Button>
				</div>
			</div>
		</div>
	)
}

export default PlatoonEquipment