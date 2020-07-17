import React, { useState } from 'react'
import { } from 'recoil'
import { Button } from 'seventh-component-library'
import { PlayerFleetGrid, PlanetGrid } from '../../components/grid'
import StarDate from '../../components/date'
import DockingBays from '../../components/dockingbays/'
import ShipHeading from './shipheading'
import { useChangeShipPosition, useSendShipToDestination } from '../../state/ships'
import './styles.css'

const Fleet = props => {
	const [ selected, setSelected ] = useState(null)
	const [ action, setAction ] = useState(null)
	const changeShipPosition = useChangeShipPosition()
	const sendToDestination = useSendShipToDestination()

	const onSelectShip = ship => {
		console.log(ship)
		setSelected(ship)
	}

	const onSelectPlanet = planet => {
		console.log(`Travel ${selected.name} (${selected.id}) => ${planet.name} (${planet.id})`)
		sendToDestination(selected, planet)
		setAction(null)
	}

	const onSelectBay = ship => {
		console.log("selected ship from bay", ship)
		setSelected(ship)
	}

	const onClickLaunch = () => {
		if (selected)
		{
			changeShipPosition(selected, 'space')
		}
		// setAction('launch')
	}

	const onClickTransfer = () => {
		setAction('transfer')
	}

	const onClickLand = () => {
		changeShipPosition(selected, 'docked')
	}

	let grid;
	if (action === 'transfer')
	{
		grid = (<PlanetGrid onSelectItem={onSelectPlanet} />)
	}
	else
	{
		grid = (<PlayerFleetGrid onSelectItem={onSelectShip} />)
	}

	return (
		<div>
			<div>
				<DockingBays planet={props.planet} onSelect={onSelectBay} />
				<div>
					<div>
						<div>
							<Button onClick={onClickLaunch} disabled={!selected}>Launch</Button>
							<Button onClick={onClickTransfer} disabled={!selected}>Transfer</Button>
							<Button onClick={onClickLand} disabled={!selected}>Land</Button>
						</div>
						<dl>
							<dt>Ship</dt>
							<dd>{selected ? selected.name : ''}</dd>
							<dt>Date</dt>
							<dd><StarDate /></dd>
							<dt>Class</dt>
							<dd>{selected ? selected.type : ''}</dd>
							<dt>Crew</dt>
							<dd>{selected ? selected.crew : ''}</dd>
							<dt>Fuel</dt>
							<dd>{selected ? selected.fuel : ''}</dd>
						</dl>
					</div>
					<div>
						<Button disabled={!selected}>Decommission</Button>
						<Button disabled={!selected}>Rename</Button>
					</div>
				</div>
			</div>
			<div>
				{/* Messages */}
			</div>
			<div className="flex-columns">
				{grid}
				<ShipHeading ship={selected} />
			</div>
		</div>
	)
}

export default Fleet