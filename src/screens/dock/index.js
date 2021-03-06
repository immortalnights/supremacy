import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import Button from '../../components/button'
import atoms from '../../state/atoms'
import DockingBays from '../../components/dockingbays/'
import ShipDetails from './shipdetails'
import { selectFirstInDock, useAssignCrew, useLoadUnloadCargo, useUnloadAllCargo, useDecommissionShip } from '../../state/ships'
import './styles.css'

const ShipCivFuelCargo = props => {
	const ship = useRecoilValue(atoms.ships(props.ship ? props.ship.id : null))
	const loadUnload = useLoadUnloadCargo(ship, { id: props.planet })
	const image = ''
	let civilians = "-"
	let fuel = "-"

	if (ship)
	{
		civilians = ship.civilians

		if (ship.capacity && ship.capacity.fuel)
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
			<CivFuelCargo onChange={onChangeCivilians} value={civilians} icon={image} iconAlt="civilians" disabled={!ship} />
			<CivFuelCargo onChange={onChangeFuel} value={fuel} icon={image} iconAlt="fuel" disabled={!ship} />
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
					<Button onHold={onHoldMore} frequency="scale" disabled={props.disabled}>More</Button>
					<Button onHold={onHoldLess} frequency="scale" disabled={props.disabled}>Less</Button>
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
						<Button onHold={onHoldMore} frequency="scale" disabled={props.disabled}>More</Button>
						<Button onHold={onHoldLess} frequency="scale" disabled={props.disabled}>Less</Button>
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
			<CargoItem type="food" available={planet.resources.food} loaded={cargo.food || 0} onChange={loadUnloadFood} disabled={!ship} />
			<CargoItem type="minerals" available={planet.resources.minerals} loaded={cargo.minerals || 0} onChange={loadUnloadMinerals} disabled={!ship} />
			<CargoItem type="fuels" available={planet.resources.fuels} loaded={cargo.fuels || 0} onChange={loadUnloadFuels} disabled={!ship} />
			<CargoItem type="energy" available={planet.resources.energy} loaded={cargo.energy || 0} onChange={loadUnloadEnergy} disabled={!ship} />
		</div>
	)
}

const Dock = props => {
	console.log("Dock.render")

	const defaultSelected = useRecoilValue(selectFirstInDock(props.planet))
	const [ selected, setSelected ] = useState(defaultSelected)
	const assignCrew = useAssignCrew()
	const unloadAll = useUnloadAllCargo(selected, { id: props.planet })
	const decommission = useDecommissionShip(selected, { id: props.planet })

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
		unloadAll()
	}

	const onDecommission = () => {
		// Return value, all minerals or fuel. All crew and cargo
		decommission()
		setSelected(null)
	}

	const canAssignCrew = selected && selected.crew === 0
	const canUnloadCargo = selected && selected.cargo.reduce((c, m) => m + c, 0) > 0
	const canDecommission = selected && selected.location.planet === props.player.capitalPlanet && selected.location.position === 'docked'

	return (
		<div className="flex-columns">
			<div>
				<div className="flex-columns" style={{justifyContent: 'space-around'}}>
					<DockingBays planet={props.planet} selected={selected} onSelect={onSelectBay} />
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
						<Button onClick={onAssignCrew} disabled={!canAssignCrew}>Crew</Button>
						<Button onClick={onUnloadCargo} disabled={!canUnloadCargo}>Unload</Button>
						<Button onClick={onDecommission} disabled={!canDecommission}>Decommission</Button>
					</div>
				</div>
			</div>
			<Cargo ship={selected} planet={props.planet} />
		</div>
	)
}

export default Dock