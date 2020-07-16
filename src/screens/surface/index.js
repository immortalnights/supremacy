import React from 'react'
import { useRecoilValue } from 'recoil'
import { Button } from 'seventh-component-library'
import DockingBays from '../../components/dockingbays/'
import { useChangeShipPosition, selectShipsAtPlanetPosition } from '../../state/ships'

const PlanetSlot = props => {

	const taken = props.id === undefined ? false : true

	return (
		<div>
			<div className="columns">
				<Button onClick={() => props.onToggleStatus(props.id, 'on')} disabled={taken === false}>On</Button>
				<Button onClick={() => props.onToggleStatus(props.id, 'off')} disabled={taken === false}>Off</Button>
			</div>
			<img onClick={() => props.onClick(props.id)} src="" alt="Empty" />
			<div>{props.name}</div>
			<div>{props.status}</div>
		</div>
	)
}

const Surface = props => {
	const changeShipPosition = useChangeShipPosition()
	const ships = useRecoilValue(selectShipsAtPlanetPosition({ planet: props.planet, position: 'surface' }))

	const onClickDockingBay = ship => {
		changeShipPosition(ship, 'surface')
	}

	const onToggleStatus = (ship, status) => {
		console.log("toggle status", ship, status)
	}

	const onClickSurfaceSlot = ship => {
		if (ship !== undefined)
		{
			changeShipPosition({ id: ship }, 'dock')
		}
	}

	const slots = []
	for (let slot = 0; slot < 6; slot++)
	{
		const ship = ships[slot]

		const id = ship ? ship.id : undefined
		const name = ship ? ship.name : undefined
		const status = ship ? ship.status : undefined
		slots.push(<PlanetSlot key={slot} id={id} name={name} status={status} onToggleStatus={onToggleStatus} onClick={onClickSurfaceSlot} />)
	}

	return (
		<div>
			<div className="columns">
				<div className="columns">
					<DockingBays planet={props.planet} onSelect={onClickDockingBay} />
				</div>
				<div>
					{slots}
				</div>
			</div>
			<div>{/*messages*/}</div>
		</div>
	)
}

export default Surface