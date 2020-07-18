import React, { useState } from 'react'
import {} from 'recoil'
import { Button } from 'seventh-component-library'
import DockingBays from '../../components/dockingbays/'
import ShipDetails from './shipdetails'
import { useAssignCrew } from '../../state/ships'

const CivFuelCargo = props => {
	return (
		<div>
			<div>{props.value}</div>
			<div>
				<div>
					<Button>More</Button>
					<Button>Less</Button>
				</div>
				<img src={props.icon} alt={props.iconAlt} />
			</div>
		</div>
	)
}

const CargoItem = props => {
	return (
		<div>
			<div>
				{/*Chart*/}
			</div>
			<div>
				<div>
					<Button>More</Button>
					<Button>Less</Button>
				</div>
				<div>{props.type}</div>
			</div>
			<div>{props.available}</div>
			<div>{props.loaded}</div>
		</div>
	)
}

const Cargo = props => {
	return (
		<div className="flex-columns">
			<CargoItem type="food" available={0} value={0} />
			<CargoItem type="minerals" available={0} value={0} />
			<CargoItem type="fuels" available={0} value={0} />
			<CargoItem type="energy" available={0} value={0} />
		</div>
	)
}

const Dock = props => {
	const [ selected, setSelected ] = useState(null)
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
				<div className="flex-columns">
					<DockingBays planet={props.planet} onSelect={onSelectBay} />
					<ShipDetails ship={selected} planet={props.planet} />
				</div>
				<div>{/*messages*/}</div>
				<div className="flex-columns">
					<div>
						<div>
							<div>{/*image*/}</div>
							<CivFuelCargo value="" icon="" iconAlt="civilians" />
							<CivFuelCargo value="" icon="" iconAlt="fuel" />
						</div>
						<div>
							<label>Class</label> {selected ? selected.type : ''}
						</div>
					</div>
					<div>
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