import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import Button from '../../components/button'
import atoms from '../../state/atoms'
import DockingBays from '../../components/dockingbays/'
import ShipDetails from './shipdetails'
import { selectFirstInDock, useAssignCrew, useLoadUnloadCargo } from '../../state/ships'
import './styles.css'

const ShipCivFuelCargo = props => {
	const ship = useRecoilValue(atoms.ships(props.ship ? props.ship.id : null))
	const loadUnload = useLoadUnloadCargo(ship, { id: props.planet })
	const image = ''
	let civilians = ''
	let fuel

	if (ship)
	{
		civilians = ship.civilians

		if (ship.maximumFuel > 0 && ship.cargo)
		{
			fuel = ship.fuel
		}
		else
		{
			fuel = 'nuclear'
		}
	}

	const onChangeCivilians = change => {
		loadUnload('civilians', change)
	}

	const onChangeFuel = change => {
		loadUnload('fuel', change)
	}

	return (
		<div className="flex-columns" style={{justifyContent: 'space-between'}}>
			<div>{/*image*/}</div>
			<CivFuelCargo onChange={onChangeCivilians} value={civilians} icon={image} iconAlt="civilians" />
			<CivFuelCargo onChange={onChangeFuel} value={fuel} icon={image} iconAlt="fuel" />
		</div>
	)
}

const CivFuelCargo = props => {
	const onHoldMore = modifiers => {
		const val = modifiers.ctrl ? 5 : 1
		props.onChange(val)
	}

	const onHoldLess = modifiers => {
		const val = modifiers.ctrl ? -5 : -1
		props.onChange(val)
	}

	return (
		<div>
			<div style={{height:'1.5em', textAlign: 'right'}}>{props.value}</div>
			<div className="flex-columns">
				<div className="flex-columns">
					<Button onHold={onHoldMore} frequency="scale">More</Button>
					<Button onHold={onHoldLess} frequency="scale">Less</Button>
				</div>
				<img src={props.icon} alt={props.iconAlt} />
			</div>
		</div>
	)
}

const CargoItem = props => {
	const onHoldMore = modifiers => {
		const val = modifiers.ctrl ? 5 : 1
		props.onChange(val)
	}

	const onHoldLess = modifiers => {
		const val = modifiers.ctrl ? -5 : -1
		props.onChange(val)
	}

	return (
		<div style={{display: 'flex', flexDirection: 'column'}}>
			<div style={{flex: 1}}>
				{/*Chart*/}
			</div>
			<div>
				<div>
					<div className="flex-columns">
						<Button onHold={onHoldMore} frequency="scale">More</Button>
						<Button onHold={onHoldLess} frequency="scale">Less</Button>
					</div>
					<div style={{textAlign: 'center'}}>{props.type}</div>
				</div>
				<div className="cargo-item planet-cargo-item">{props.available.toFixed(0)}</div>
				<div className="cargo-item ship-cargo-item">{props.loaded.toFixed(0)}</div>
			</div>
		</div>
	)
}

const Cargo = props => {
	const ship = useRecoilValue(atoms.ships(props.ship ? props.ship.id : null))
	const planet = useRecoilValue(atoms.planets(props.planet))
	const loadUnload = useLoadUnloadCargo(ship, { id: props.planet })

	let cargo = {}
	if (ship && ship.cargo)
	{
		cargo.food = ship.cargo.food
		cargo.minerals = ship.cargo.minerals
		cargo.fuels = ship.cargo.fuels
		cargo.energy = ship.cargo.energy
	}

	const loadUnloadFood = change => {
		loadUnload('food', change)
	}

	const loadUnloadMinerals = change => {
		loadUnload('minerals', change)
	}

	const loadUnloadFuels = change => {
		loadUnload('fuels', change)
	}

	const loadUnloadEnergy = change => {
		loadUnload('energy', change)
	}

	return (
		<div className="flex-columns">
			<CargoItem type="food" available={planet.resources.food} loaded={cargo.food || 0} onChange={loadUnloadFood} />
			<CargoItem type="minerals" available={planet.resources.minerals} loaded={cargo.minerals || 0} onChange={loadUnloadMinerals} />
			<CargoItem type="fuels" available={planet.resources.fuels} loaded={cargo.fuels || 0} onChange={loadUnloadFuels} />
			<CargoItem type="energy" available={planet.resources.energy} loaded={cargo.energy || 0} onChange={loadUnloadEnergy} />
		</div>
	)
}

const Dock = props => {
	console.log("Dock.render")

	const defaultSelected = useRecoilValue(selectFirstInDock(props.planet))
	const [ selected, setSelected ] = useState(defaultSelected)
	const assignCrew = useAssignCrew()

	const onSelectBay = ship => {
		setSelected(ship)
	}

	const onAssignCrew = () => {
		if (selected)
		{
			assignCrew(selected, { id: props.planet })
		}
	}

	const onUnloadCargo = () => {

	}

	const onDecommission = () => {

	}

	return (
		<div className="flex-columns">
			<div>
				<div className="flex-columns" style={{justifyContent: 'space-around'}}>
					<DockingBays planet={props.planet} onSelect={onSelectBay} />
					<ShipDetails ship={selected} planet={props.planet} />
				</div>
				<div>{/*messages*/}</div>
				<div className="flex-columns" style={{justifyContent: 'space-around'}}>
					<div>
						<ShipCivFuelCargo ship={selected} planet={props.planet} />
						<div>
							<label>Class</label> {selected ? selected.type : ''}
						</div>
					</div>
					<div className="stacked-buttons">
						<Button onClick={onAssignCrew}>Crew</Button>
						<Button onClick={onUnloadCargo}>Unload</Button>
						<Button onClick={onDecommission}>Decomission</Button>
					</div>
				</div>
			</div>
			<Cargo ship={selected} planet={props.planet} />
		</div>
	)
}

export default Dock