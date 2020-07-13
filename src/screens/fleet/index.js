import React, { useState, useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import { Button } from 'seventh-component-library'
import { PlayerFleetGrid, PlanetGrid } from '../../components/grid'
import StarDate from '../../components/date'
import atoms from '../../state/atoms'
import { useChangeShipPosition, selectPlayerShips, selectShipsAtPlanetPosition } from '../../state/ships'
import './styles.css'

const DockingBay = props => {
	const ships = useRecoilValue(selectShipsAtPlanetPosition({ planet: props.planet, position: 'dock' }))

	const bays = []
	for (let bay = 0; bay < 3; bay++)
	{
		const ship = ships[bay]
		bays.push(<li key={bay} className="bay" title={ship ? ship.name : ''} onClick={() => props.onSelect(ship)}>{ship ? ship.name : ''}</li>)
	}

	return (
		<div>
			<div className="">
				<label>Planet</label>
				{props.planet.name}
			</div>
			<div className="docking-bays">
				<label>Docking Bays</label>
				<ol>
					{bays}
				</ol>
			</div>
		</div>
	)
}

const ShipHeading = props => {
	const values = {
		name: '',
		from: '',
		to: '',
		eda: '',
		fuel: '',
	}

	if (props.ship && props.ship.heading)
	{
		values.name = props.ship.name
		values.from = props.ship.heading.from
		values.to = props.ship.heading.to
		values.etd = props.ship.heading.eda
		values.fuel = props.ship.fuel
	}

	return (
		<div>
			<label>Heading</label>
			<dl>
				<dd>{values.name}</dd>
				<dt>Ship</dt>
				<dd>{values.from}</dd>
				<dt>From</dt>
				<dd>{values.to}</dd>
				<dt>To</dt>
				<dd>{values.eda}</dd>
				<dt>EDA</dt>
				<dd>{values.fuel}</dd>
				<dt>Fuel</dt>
			</dl>
		</div>
	)
}

const Fleet = props => {
	const ships = useRecoilValue(selectPlayerShips)
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
				<DockingBay planet={props.planet.id} onSelect={onSelectBay} />
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