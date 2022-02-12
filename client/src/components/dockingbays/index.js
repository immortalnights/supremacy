import React from 'react'
import { useRecoilValue } from 'recoil'
import atoms from '../../state/atoms'
import { selectShipsAtPlanetPosition } from '../../state/ships'
import './styles.css'

const DockingBays = props => {
	const ships = useRecoilValue(selectShipsAtPlanetPosition({ planet: props.planet, position: 'docked' }))
	const planet = useRecoilValue(atoms.planets(props.planet))

	const bays = []
	for (let bay = 0; bay < 3; bay++)
	{
		const ship = ships[bay]

		const classes = ['bay']

		if (ship != null && props.selected != null && props.selected.id === ship.id)
		{
			classes.push('selected')
		}

		bays.push(<li key={bay} className={classes.join(' ')} title={ship ? ship.name : ''} onClick={() => props.onSelect(ship)}>{ship ? ship.name : ''}</li>)
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