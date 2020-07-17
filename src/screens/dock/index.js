import React, { useState } from 'react'
import {} from 'recoil'
import { Button } from 'seventh-component-library'
import DockingBays from '../../components/dockingbays/'

const ShipDetails = props => {

	const details = {
		name: '',
		civilians: '', // on the planet
		seats: '',
		requiredCrew: '',
		capacity: '',
		maxFuel: '',
		payload: '',
		value: '',
	}

	return (
		<dl>
			<dt>Ship</dt>
			<dd>{details.name}</dd>
			<dt>Civilians</dt>
			<dd>{details.civilians}</dd>
			<dt>Seats</dt>
			<dd>{details.seats}</dd>
			<dt>To Crew</dt>
			<dd>{details.requiredCrew}</dd>
			<dt>Capacity</dt>
			<dd>{details.capacity}</dd>
			<dt>Max Fuel</dt>
			<dd>{details.maxFuel}</dd>
			<dt>Payload</dt>
			<dd>{details.payload}</dd>
			<dt>Value</dt>
			<dd>{details.value}</dd>
		</dl>
	)
}

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
		<div>
			<CargoItem type="food" available={0} value={0} />
			<CargoItem type="minerals" available={0} value={0} />
			<CargoItem type="fuels" available={0} value={0} />
			<CargoItem type="energy" available={0} value={0} />
		</div>
	)
}

const Dock = props => {
	const [ selected, setSelected ] = useState(null)

	return (
		<div>
			<div>
				<div className="columns">
					<DockingBays planet={props.planet} />
					<ShipDetails ship={selected} />
				</div>
				<div>{/*messages*/}</div>
				<div className="columns">
					<div>
						<div>
							<div>{/*image*/}</div>
							<CivFuelCargo value="" icon="" iconAlt="civilians" />
							<CivFuelCargo value="" icon="" iconAlt="fuel" />
						</div>
						<div>
							<label>Class</label> {''} 
						</div>
					</div>
					<div>
						<Button>Crew</Button>
						<Button>Unload</Button>
						<Button>Decomission</Button>
					</div>
				</div>
			</div>
			<div>
				<Cargo ship={selected} planet={props.planet} />
			</div>
		</div>
	)
}

export default Dock