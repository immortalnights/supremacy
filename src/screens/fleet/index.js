import React, { useState } from 'react'
import { } from 'recoil'
import Button from '../../components/button'
import { PlayerFleetGrid, PlanetGrid } from '../../components/grid'
import DockingBays from '../../components/dockingbays/'
import InlineName from '../../components/inlinename'
import Message from '../../components/message'
import ShipHeading from './shipheading'
import ShipDetails from './shipdetails'
import { useNavigate } from '../../state/nav'
import { useChangeShipPosition, useSendShipToDestination, useRename } from '../../state/ships'
import './styles.css'

const Fleet = props => {
	const [ selected, setSelected ] = useState(null)
	const [ rename, setRename ] = useState(false)
	const [ action, setAction ] = useState(null)
	const changeShipPosition = useChangeShipPosition()
	const sendToDestination = useSendShipToDestination()
	const renameShip = useRename()
	const navigate = useNavigate()

	console.log("Fleet.render")

	const onSelectShip = ship => {
		setRename(false)
		setSelected(ship)

		if (ship.location)
		{
			if (ship.location.planet && ship.location.planet !== props.planet)
			{
				navigate('fleet', ship.location.planet)
			}
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

	const onClickAbort = () => {
		console.warn("Abort travel unimplemented")
	}

	const onClickRename = () => {
		setRename(true)
	}

	const onCancelRename = () => {
		setRename(false)
	}

	const onSetName = name => {
		renameShip(selected, name)
		setRename(false)
	}

	let message
	if (selected)
	{
		if (selected.heading)
		{
			message = `${selected.name} is travelling to ${selected.heading.to.name}`
		}
		else if (selected.location && selected.location.planet)
		{
			switch (selected.location.position)
			{
				case 'orbit':
				{
					message = `${selected.name} is in orbit`
					break
				}
				case 'surface':
				{
					message = `${selected.name} is on the surface`
					break
				}
				case 'docked':
				{
					message = `${selected.name} is in a docking bay`
					break
				}
				default:
				{
					console.log("Unhandled position", selected)
					break
				}
			}
		}
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
			<div className="flex-columns">
				<DockingBays planet={props.planet} onSelect={onSelectBay} />
				<div>
					<div>
						<div className="flex-columns">
							<Button onClick={onClickLaunch} disabled={!selected}>Launch</Button>
							<Button onClick={onClickTransfer} disabled={!selected}>Transfer</Button>
							<Button onClick={onClickLand} disabled={!selected}>Land</Button>
						</div>
						<ShipDetails ship={selected} />
					</div>
				</div>
				<div className="stacked-buttons">
					<Button onClick={onClickAbort} disabled={!selected || !selected.heading}>Abort</Button>
					<Button onClick={onClickRename} disabled={!selected}>Rename</Button>
				</div>
			</div>
			<div>
				{rename ? (<InlineName message="Rename ship" value={selected.name} onCancel={onCancelRename} onComplete={onSetName} />) : <Message text={message} />}
			</div>
			<div className="flex-columns">
				{grid}
				<ShipHeading ship={selected} />
			</div>
		</div>
	)
}

export default Fleet