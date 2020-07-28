import React, { useState } from 'react'
import { } from 'recoil'
import Button from '../../components/button'
import { PlayerFleetGrid, PlanetGrid } from '../../components/grid'
import DockingBays from '../../components/dockingbays/'
import ShipHeading from './shipheading'
import ShipDetails from './shipdetails'
import { useNavigate } from '../../state/nav'
import { useChangeShipPosition, useSendShipToDestination } from '../../state/ships'
import './styles.css'

const Fleet = props => {
	const [ selected, setSelected ] = useState(null)
	const [ action, setAction ] = useState(null)
	const changeShipPosition = useChangeShipPosition()
	const sendToDestination = useSendShipToDestination()
	const navigate = useNavigate()

	console.log("Fleet.render")

	const onSelectShip = ship => {
		if (ship.location.planet === props.planet)
		{
			setSelected(ship)
		}
		else
		{
			navigate('fleet', ship.location.planet)
		}
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
			changeShipPosition(selected, 'orbit')
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
						<ShipDetails ship={selected} />
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