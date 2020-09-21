import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import Button from '../../components/button'
import DockingBays from '../../components/dockingbays/'
import { ShipPlatoons, PlanetPlatoons } from '../../components/platoongrid/'
import { selectPlanetStrength, selectPlanetTroops } from '../../logic/planets'
import state from '../../state/atoms'
import { selectLocalPlayer } from '../../state/game'
import { useTransferPlatoon } from '../../state/platoons'
import { useChangeAggression } from '../../state/planets'

const ShipDetails = props => {
	const ship = props.ship || { id: null }

	return (
		<div>
			<label>Ship</label>
			<div>{ship.name}</div>
			<ShipPlatoons ship={ship.id} onSelect={props.onSelect} />
		</div>
	)
}

const Combat = props => {
	const [ ship, setShip ] = useState(null)
	const planet = useRecoilValue(state.planets(props.planet))
	const player = useRecoilValue(selectLocalPlayer)
	const transferPlatoon = useTransferPlatoon(planet, ship)
	const defenderStrength = useRecoilValue(selectPlanetStrength({ planet: props.planet, role: 'defender' }))
	const playerTroops = useRecoilValue(selectPlanetTroops(props.planet, player))
	const attackerStrength = useRecoilValue(selectPlanetStrength({ planet: props.planet, role: 'attacker' }))
	const changeAggression = useChangeAggression(planet)
	const messages = ''
	const aggression = player.id === planet.owner ? planet.defenderAggression : planet.attackerAggression

	const onSelectShip = ship => {
		setShip(ship)
	}

	const onLoadPlatoon = platoon => {
		if (ship)
		{
			transferPlatoon('load', platoon)
		}
	}

	const onUnloadPlatoon = platoon => {
		if (ship)
		{
			transferPlatoon('unload', platoon)
		}
	}

	return (
		<div className="flex-columns">
			<div>
				<div className="flex-columns">
					<DockingBays planet={props.planet} onSelect={onSelectShip} />
					<ShipDetails ship={ship} onSelect={onUnloadPlatoon} />
				</div>
				<div>{messages}</div>
				<div>
					<PlanetPlatoons planet={props.planet} onSelect={onLoadPlatoon} />
				</div>
			</div>
			<div>{/*power comparison*/}</div>
			<div>
				<div>{/*image*/}</div>
				<dl>
					<dt>Your Total Stength</dt>
					<dd>{defenderStrength.toFixed(0)}</dd>
					<dt>Enemy Total Stength</dt>
					<dd>{attackerStrength.toFixed(0)}</dd>
					<dt>Total Troops Remaining</dt>
					<dd>{playerTroops}</dd>
				</dl>
				<div>
					<label>Aggression</label>
					<div className="flex-columns">
						<div>
							<div><Button onClick={() => changeAggression(1)}>Inc</Button></div>
							<div><Button onClick={() => changeAggression(-1)}>Dec</Button></div>
						</div>
						<div><img src="" alt="aggression" /></div>
						<div>{aggression}</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Combat