import React from 'react'
import { useRecoilValue } from 'recoil'
import { Button } from 'seventh-component-library'
import DockingBays from '../../components/dockingbays/'
import { useChangeShipPosition, useToggleShipOnSurface, selectShipsAtPlanetPosition } from '../../state/ships'

const PlanetSlot = props => {

	const taken = props.id === undefined ? false : true

	return (
		<div>
			<div className="flex-columns">
				<Button onClick={() => props.onToggleStatus(props.id, 'activate')} disabled={taken === false}>On</Button>
				<Button onClick={() => props.onToggleStatus(props.id, 'deactivate')} disabled={taken === false}>Off</Button>
			</div>
			<div onClick={() => props.onClick(props.id)} style={{cursor:'pointer'}}>
				<img src="" alt="Empty" />
				<div>{props.name}</div>
				<div>{props.status}</div>
			</div>
		</div>
	)
}

const Surface = props => {
	const changeShipPosition = useChangeShipPosition()
	const toggleShipOnSurface = useToggleShipOnSurface()
	const ships = useRecoilValue(selectShipsAtPlanetPosition({ planet: props.planet, position: 'surface' }))

	const onClickDockingBay = ship => {
		changeShipPosition(ship, 'surface')
	}

	const onToggleStatus = (ship, status) => {
		console.log("toggle status", ship, status)
		toggleShipOnSurface({ id: ship }, status)
	}

	const onClickSurfaceSlot = ship => {
		if (ship !== undefined)
		{
			changeShipPosition({ id: ship }, 'docked')
		}
	}

	const slots = []
	for (let slot = 0; slot < 6; slot++)
	{
		const ship = ships[slot]

		const id = ship ? ship.id : undefined
		const name = ship ? ship.name : undefined
		const status = ship && ship.location.state === 'active' ? "Running" : ""
		slots.push(<PlanetSlot key={slot} id={id} name={name} status={status} onToggleStatus={onToggleStatus} onClick={onClickSurfaceSlot} />)
	}

	return (
		<div>
			<div className="flex-columns">
				<div className="flex-columns">
					<DockingBays planet={props.planet} onSelect={onClickDockingBay} />
				</div>
				<div className="flex-columns">
					{slots}
				</div>
			</div>
			<div>{/*messages*/}</div>
		</div>
	)
}

export default Surface