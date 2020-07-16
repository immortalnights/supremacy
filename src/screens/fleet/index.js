import React, { useState } from 'react'
import { } from 'recoil'
import { Button } from 'seventh-component-library'
import { PlayerFleetGrid, PlanetGrid } from '../../components/grid'
import StarDate from '../../components/date'
import DockingBays from '../../components/dockingbays/'
import ShipHeading from './shipheading'
import { useChangeShipPosition } from '../../state/ships'
import './styles.css'

const Fleet = props => {
	const [ selected, setSelected ] = useState(null)
	const [ action, setAction ] = useState(null)
	const changeShipPosition = useChangeShipPosition()

	const onSelectShip = ship => {
		console.log(ship)
		setSelected(ship)
	}

	const onSelectPlanet = planet => {
		console.log(planet)
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
		changeShipPosition(selected, 'dock')
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
						<div>
							<label>Ship</label>
							<span>{selected ? selected.name : ''}</span>
							<label>Date</label>
							<StarDate />
							<label>Class</label>
							<span>{selected ? selected.type : ''}</span>
							<label>Crew</label>
							<span>{selected ? selected.crew : ''}</span>
							<label>Fuel</label>
							<span>{selected ? selected.fuel : ''}</span>
						</div>
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
			<div>
				{grid}
				<ShipHeading ship={selected} />
			</div>
		</div>
	)
}

export default Fleet