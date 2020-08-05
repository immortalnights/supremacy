import React from 'react'
import {} from 'recoil'
import Button from '../../components/button'
import DockingBays from '../../components/dockingbays/'
import { ShipPlatoons, PlanetPlatoons } from '../../components/platoongrid/'

const ShipDetails = props => {
	const ship = { name: '' }

	return (
		<div>
			<label>Ship</label>
			<div>{ship.name}</div>
			<ShipPlatoons />
		</div>
	)
}

const Combat = props => {
	const playerStrength = 0
	const enermyStrength = 0
	const messages = ''
	const aggression = 0

	return (
		<div className="flex-columns">
			<div>
				<div className="flex-columns">
					<DockingBays planet={props.planet} />
					<ShipDetails />
				</div>
				<div>{messages}</div>
				<div>
					<PlanetPlatoons />
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