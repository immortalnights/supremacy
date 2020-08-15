import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import Button from '../../components/button'
import { selectHumanPlayer } from '../../state/game'
import { selectCapitalPlanet } from '../../state/planets'
import { MAXIMUM_PLATOONS, ordinal, usePlatoonCostCalc } from '../../logic/platoons'
import { selectPlayerPlatoonIndexes, selectPlatoon, selectPlayerPlatoon, useChangeTroops, useCommissionPlatoon } from '../../state/platoons'
import PlatoonEquipment from './platoonequipment'

const Training = props => {
	const player = useRecoilValue(selectHumanPlayer)
	const capital = useRecoilValue(selectCapitalPlanet(player))
	const [ index, setIndex ] = useState(1)
	const platoon = useRecoilValue(selectPlayerPlatoon({ player: player.id, name: ordinal(index) }))
	const changeTroops = useChangeTroops(platoon, capital)
	const commission = useCommissionPlatoon(platoon, capital)
	const cost = usePlatoonCostCalc(platoon)
	let message = ''

	const onHoldMore = modifiers => {
		const val = modifiers.ctrl ? 5 : 1
		changeTroops(val)
	}

	const onHoldLess = modifiers => {
		const val = modifiers.ctrl ? -5 : -1
		changeTroops(val)
	}

	const nextPlatoon = () => {
		const next = index + 1
		setIndex(next > MAXIMUM_PLATOONS ? 1 : next)
	}

	const prevPlatoon = () => {
		const prev = index - 1
		setIndex(prev < 1 ? MAXIMUM_PLATOONS : prev)
	}

	if (platoon.commissioned)
	{
		message = 'Platoon equipped'
	}
	else
	{
		message = `Cost ${cost} credits`
	}

	return (
		<div>
			<div className="flex-columns">
				<div className="flex-columns">
					<div>Platoon</div>
					<div>{platoon.name}</div>
					<div className="stacked-buttons">
						<Button className="small" onClick={nextPlatoon}>Up</Button>
						<Button className="small" onClick={prevPlatoon}>Down</Button>
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
					<div>{capital.population.toFixed(0)}</div>
				</div>
			</div>
			<div className="flex-columns">
				<PlatoonEquipment platoon={platoon} />
				<div>
					<div>
						<label>Location</label> {capital.name}
					</div>
					<div>
						<label>Credits</label> {capital.resources.credits.toFixed(0)}
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
						<label>Calibre</label> {platoon.calibre.toFixed(0)}%
					</div>
				</div>
			</div>
		</div>
	)
}

export default Training