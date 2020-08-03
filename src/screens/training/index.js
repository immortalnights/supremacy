import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import Button from '../../components/button'
import { selectHumanPlayer } from '../../state/game'
import { selectCapitalPlanet } from '../../state/planets'
import { selectPlayerPlatoon, useChangeTroops, useCommissionPlatoon } from '../../state/platoons'
import PlatoonEquipment from './platoonequipment'

const Training = props => {
	const player = useRecoilValue(selectHumanPlayer)
	const capital = useRecoilValue(selectCapitalPlanet(player))
	const [ name ] = useState('1st')
	const platoon = useRecoilValue(selectPlayerPlatoon({ player: player.id, name }))
	const changeTroops = useChangeTroops(platoon, capital)
	const commission = useCommissionPlatoon(platoon)
	const message = ''

	console.log("Training", platoon)

	const onHoldMore = modifiers => {
		const val = modifiers.ctrl ? 5 : 1
		changeTroops(val)
	}

	const onHoldLess = modifiers => {
		const val = modifiers.ctrl ? -5 : -1
		changeTroops(val)
	}

	return (
		<div>
			<div className="flex-columns">
				<div className="flex-columns">
					<div>Platoon</div>
					<div>{platoon.name}</div>
					<div className="stacked-buttons">
						<Button className="small" onClick={null}>Up</Button>
						<Button className="small" onClick={null}>Down</Button>
					</div>
				</div>
				<div className="flex-columns">
					<div>Troops</div>
					<div>{platoon.troops}</div>
					<div className="stacked-buttons">
						<Button className="small" onHold={onHoldMore} frequency="scale">Up</Button>
						<Button className="small" onHold={onHoldLess} frequency="scale">Down</Button>
					</div>
				</div>
				<div className="flex-columns">
					<div>Civilians</div>
					<div>{capital.population}</div>
				</div>
			</div>
			<div className="flex-columns">
				<PlatoonEquipment platoon={platoon} />
				<div>
					<div>
						<label>Location</label> {capital.name}
					</div>
					<div>
						<label>Credits</label> {capital.resources.credits}
					</div>
					<div>
						<label>Rank</label> {platoon.rank}
					</div>
					<div>
						{message}
					</div>
					<div>{/*messages*/}</div>
					<div className="flex-columns">
						<Button onClick={commission}>Equip</Button>
						<Button>Disband</Button>
					</div>
					<div>
						<label>Calibre</label> {platoon.calibre}%
					</div>
				</div>
			</div>
		</div>
	)
}

export default Training