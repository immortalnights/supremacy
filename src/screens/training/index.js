import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import Button from '../../components/button'
import { selectHumanPlayer } from '../../state/game'
import { selectCapitalPlanet } from '../../state/planets'
import { MAXIMUM_PLATOONS, PLATOON_RANKS, ordinal, usePlatoonCostCalc } from '../../logic/platoons'
import { selectPlayerPlatoon, useChangeTroops, useCommissionPlatoon, useDisbandPlatoon } from '../../state/platoons'
import PlatoonEquipment from './platoonequipment'

const Training = props => {
	console.log("Training.render")
	const player = useRecoilValue(selectHumanPlayer)
	const capital = useRecoilValue(selectCapitalPlanet(player))
	const [ index, setIndex ] = useState(1)
	const platoon = useRecoilValue(selectPlayerPlatoon({ player: player.id, name: ordinal(index) }))
	const changeTroops = useChangeTroops(platoon, capital)
	const commission = useCommissionPlatoon(player, capital)
	const disband = useDisbandPlatoon(platoon)
	const cost = usePlatoonCostCalc(platoon)
	let message = ''

	const canDisband = platoon.commissioned && platoon.location.planet === capital.id

	const getModifierValue = modifiers => {
		let val = 1
		if (modifiers.alt)
		{
			val = 200
		}
		else if (modifiers.ctrl)
		{
			val = 10
		}

		return val
	}

	const onHoldMore = modifiers => {
		const val = getModifierValue(modifiers)
		changeTroops(val)
	}

	const onHoldLess = modifiers => {
		const val = -getModifierValue(modifiers)
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
						<Button className="small" onHold={onHoldMore} frequency="scale" disabled={platoon.commissioned}>Up</Button>
						<Button className="small" onHold={onHoldLess} frequency="scale" disabled={platoon.commissioned}>Down</Button>
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
						<label>Location</label> {platoon.commissioned ? platoon.location.name : "-"}
					</div>
					<div>
						<label>Credits</label> {capital.resources.credits.toFixed(0)}
					</div>
					<div>
						<label>Rank</label> {platoon.commissioned ? PLATOON_RANKS[platoon.rank] : "-"}
					</div>
					<div>
						{message}
					</div>
					<div>{/*messages*/}</div>
					<div className="flex-columns">
						<Button onClick={() => commission(platoon)} disabled={platoon.commissioned || platoon.troops === 0}>Equip</Button>
						<Button onClick={disband} disabled={!canDisband}>Disband</Button>
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