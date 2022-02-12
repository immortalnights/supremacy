import React from 'react'
import { useRecoilValue } from 'recoil'
import { selectPlanets } from '../../state/planets'
import { selectPlayerShips } from '../../state/ships'
import './styles.css'

const Grid = props => {
	const rows = []
	for (let rowIndex = 0; rowIndex < 8; rowIndex++)
	{
		const row = []
		for (let colIndex = 0; colIndex < 4; colIndex++)
		{
			const index = (colIndex * 8) + rowIndex
			let cell
			if (props.items[index])
			{
				const item = props.items[index]

				const classes = []

				if (props.selected && item.id === props.selected.id)
				{
					classes.push('selected')
				}

				if (props.classNamesForItem)
				{
					classes.push(props.classNamesForItem(item))
				}

				cell = (<td key={index} title={item.name + " (" + item.type + ")"} className={classes.join(' ')} onClick={e => props.onSelectItem(item)}>{item.name}</td>)
			}
			else
			{
				cell = (<td key={index}></td>)
			}

			row.push(cell)
		}

		rows.push(<tr key={rowIndex}>{row}</tr>)
	}

	return (
		<table className="grid">
			<tbody>{rows}</tbody>
		</table>
	)
}

Grid.defaultProps = {
	onSelectItem: () => {},
	items: []
}

export const PlanetGrid = props => {
	let planets = useRecoilValue(selectPlanets)
	planets = planets.map(p => (p.owner != null && p.habitable) ? p : null)

	const classNamesForItem = item => {
		return (item && item.owner === props.player.id) ? 'planet friendly' : 'planet enemy'
	}

	return (<Grid items={planets} {...props} classNamesForItem={props.player && classNamesForItem} />)
}

export const PlayerFleetGrid = props => {
	const ships = useRecoilValue(selectPlayerShips)
	return (<Grid items={ships} {...props} />)
}

export default Grid
