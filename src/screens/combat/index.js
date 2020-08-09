import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import Button from '../../components/button'
import DockingBays from '../../components/dockingbays/'
import { ShipPlatoons, PlanetPlatoons } from '../../components/platoongrid/'
import { useTransferPlatoon } from '../../state/platoons'

const ShipDetails = props => {
	const ship = props.ship || {}

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
	const transferPlatoon = useTransferPlatoon({ id: props.planet }, ship)
	// const useRecoilValue()
	const playerStrength = 0
	const enermyStrength = 0
	const messages = ''
	const aggression = 0

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
					<dd>{playerStrength}</dd>
					<dt>Enemy Total Stength</dt>
					<dd>{playerStrength}</dd>
					<dt>Total Troops Remaining</dt>
					<dd>{playerStrength}</dd>
				</dl>
				<div>
					<label>Aggression</label>
					<div className="flex-columns">
						<div>
							<div><Button>Inc</Button></div>
							<div><Button>Dec</Button></div>
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