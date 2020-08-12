import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { Button } from 'seventh-component-library'
import { useNavigate } from '../../state/nav'
import StarDate from '../../components/date'
import { PlanetGrid } from '../../components/grid'
import store from '../../state/atoms'
import { useChangeTax } from '../../state/planets'
import { selectShipsAtPlanetPosition } from '../../state/ships'
import './styles.css'

const PlanetOverview = props => {
	// const platoons = useRecoilValue(store.platoons)
	const planet = useRecoilValue(store.planets(props.id))
	const changeTax = useChangeTax()

	if (!planet)
	{
		return (<div>Planet {props.id} does not exist</div>)
	}

	const onChangeTax = value => {
		changeTax({ id: props.id }, value)
	}

	return (
		<div className="flex-columns">
			<dl>
				<dt>Planet</dt>
				<dd>{planet.name || planet.id}</dd>
				<dt>Date</dt>
				<dd><StarDate /></dd>
				<dt>Status</dt>
				<dd>{planet.status}</dd>
				<dt>Credits</dt>
				<dd>{planet.resources.credits.toFixed(0)}</dd>

				<dt>Food</dt>
				<dd>{planet.resources.foodChange} {planet.resources.food.toFixed(0)} T.</dd>
				<dt>Minerals</dt>
				<dd>{planet.resources.minerals.toFixed(0)} T.</dd>
				<dt>Fuels</dt>
				<dd>{planet.resources.fuels.toFixed(0)} T.</dd>
				<dt>Energy</dt>
				<dd>{planet.resources.energy.toFixed(0)} T.</dd>
			</dl>
			<dl>
				<dt>Population</dt>
				<dd>{planet.population}</dd>
				<dt>Growth</dt>
				<dd>{planet.growthChange} {Math.floor(planet.growth)} %</dd>
				<dt>Morale</dt>
				<dd>{planet.morale.toFixed(0)} %</dd>

				<dt className="flex-columns">
					<div style={{display: 'flex', flexDirection: 'column'}}>
						<Button onClick={() => onChangeTax(1)}>Inc</Button>
						<Button onClick={() => onChangeTax(-1)}>Dec</Button>
					</div>
					<span style={{flex: '1', margin: 'auto'}}>Tax Rate</span>
				</dt>
				<dd>{planet.tax} %</dd>

				<dt>Military Strength</dt>
				<dd>{0}</dd>
			</dl>
		</div>
	)
}

const IconGrid = props => {
	const rows = []
	for (let rowIndex = 0; rowIndex < 2; rowIndex++)
	{
		const row = []
		for (let colIndex = 0; colIndex < 3; colIndex++)
		{
			const index = colIndex + (rowIndex * 3)
			let cell
			if (props.items[index])
			{
				const item = props.items[index]
				cell = (<td key={index} title={item.name + " (" + item.type + ")"} onClick={e => props.onSelectItem(item)}>{item.name}</td>)
			}
			else
			{
				cell = (<td key={index} className="empty">Empty</td>)
			}

			row.push(cell)
		}

		rows.push(<tr key={rowIndex}>{row}</tr>)
	}

	return (
		<div className="icon-grid">
			<table>
				<tbody>{rows}</tbody>
			</table>
		</div>
	)
}

const OverviewSlots = props => {
	const [ slotType, setSlotType ] = useState('surface')
	const key = { planet: props.planet, position: slotType }
	const planet = useRecoilValue(store.planets(props.planet))
	const ships = useRecoilValue(selectShipsAtPlanetPosition(key))

	// for some reason this is being re-rendered on tick
	// console.log("OverviewSlots.render", key)

	const onSelectItem = item => {
		// Noop
	}

	let message
	switch (slotType)
	{
		case 'orbit':
		{
			message = `Ships in orbit of ${planet.name}`
			break
		}
		case 'surface':
		{
			message = `Ships on surface of ${planet.name}`
			break
		}
		case 'docked':
		{
			message = `Ships docked at ${planet.name}`
			break
		}
		default:
		{
			break
		}
	}

	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<div>
				<Button onClick={() => setSlotType('orbit')}>Ships in Orbit</Button>
				<Button onClick={() => setSlotType('surface')}>Ships on the Surface</Button>
				<Button onClick={() => setSlotType('docked')}>Ships Docked</Button>
			</div>
			<div style={{textAlign: 'center'}}>{message}</div>
			<IconGrid items={ships} onSelectItem={onSelectItem} />
		</div>
	)
}

const Overview = props => {
	const navigate = useNavigate()
	// const [ selected, setSelected ] = useState(props.planet)
	const selected = props.planet

	const onSelectItem = item => {
		// setSelected(item.id)
		console.log("Select planet", item.id)
		// setView({ screen: 'overview', planet: item.id })
		navigate('overview', item.id)
	}

	console.log("render overview")

	return (
		<div>
			<div className="flex-columns">
				<div style={{display: 'flex', flexDirection: 'column'}}>
					<Button>Rename</Button>
					<Button>Transfer Credits</Button>
				</div>
				<PlanetOverview id={selected} />
			</div>
			<div className="flex-columns">
				<div>
					<div>Messages</div>
					<PlanetGrid onSelectItem={onSelectItem} />
				</div>
				<OverviewSlots planet={selected} />
			</div>
		</div>
	)
}

export default Overview