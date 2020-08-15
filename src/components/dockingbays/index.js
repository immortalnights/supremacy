import React from 'react'
import { useRecoilValue } from 'recoil'
import atoms from '../../state/atoms'
import { selectShipsAtPlanetPosition } from '../../state/ships'

const DockingBays = props => {
	const ships = useRecoilValue(selectShipsAtPlanetPosition({ planet: props.planet, position: 'docked' }))
	const planet = useRecoilValue(atoms.planets(props.planet))

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
				{planet.name}
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

DockingBays.defaultProps = {
	onSelect: () => {},
	planet: undefined
}

export default DockingBays