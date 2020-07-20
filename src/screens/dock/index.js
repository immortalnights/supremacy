import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { Button } from 'seventh-component-library'
import atoms from '../../state/atoms'
import DockingBays from '../../components/dockingbays/'
import ShipDetails from './shipdetails'
import { selectFirstInDock, useAssignCrew } from '../../state/ships'
import './styles.css'

const ShipCivFuelCargo = props => {
	const ship = useRecoilValue(atoms.ships(props.ship ? props.ship.id : null))
	const image = ''
	let civilians = ''
	let fuel

	if (ship)
	{
		civilians = ship.cargo ? ship.cargo.civilians : 0

		if (ship.maximumFuel > 0 && ship.cargo)
		{
			fuel = ship.cargo.fuels
		}
		else
		{
			fuel = 'nuclear'
		}
	}

	return (
		<div className="flex-columns" style={{justifyContent: 'space-between'}}>
			<div>{/*image*/}</div>
			<CivFuelCargo value={civilians} icon="" iconAlt="civilians" />
			<CivFuelCargo value={fuel} icon="" iconAlt="fuel" />
		</div>
	)
}

const CivFuelCargo = props => {
	return (
		<div>
			<div style={{height:'1.5em', textAlign: 'right'}}>{props.value}</div>
			<div className="flex-columns">
				<div>
					<div><Button>More</Button></div>
					<div><Button>Less</Button></div>
				</div>
				<img src={props.icon} alt={props.iconAlt} />
			</div>
		</div>
	)
}

const CargoItem = props => {
	return (
		<div style={{display: 'flex', flexDirection: 'column'}}>
			<div style={{flex: 1}}>
				{/*Chart*/}
			</div>
			<div>
				<div>
					<div>
						<Button>More</Button>
						<Button>Less</Button>
					</div>
					<div style={{textAlign: 'center'}}>{props.type}</div>
				</div>
				<div className="cargo-item planet-cargo-item">{props.available}</div>
				<div className="cargo-item ship-cargo-item">{props.loaded}</div>
			</div>
		</div>
	)
}

const Cargo = props => {
	const ship = useRecoilValue(atoms.ships(props.ship ? props.ship.id : null))
	const planet = useRecoilValue(atoms.planets(props.planet))

	let cargo = {}
	if (ship && ship.cargo)
	{
		cargo.food = ship.cargo.food
		cargo.minerals = ship.cargo.minerals
		cargo.fuels = ship.cargo.fuels
		cargo.energy = ship.cargo.energy
	}

	return (
		<div className="flex-columns">
			<CargoItem type="food" available={planet.resources.food} loaded={cargo.food || 0} />
			<CargoItem type="minerals" available={planet.resources.minerals} loaded={cargo.minerals || 0} />
			<CargoItem type="fuels" available={planet.resources.fuels} loaded={cargo.fuels || 0} />
			<CargoItem type="energy" available={planet.resources.energy} loaded={cargo.energy || 0} />
		</div>
	)
}

const Dock = props => {
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
						<ShipCivFuelCargo ship={selected} />
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