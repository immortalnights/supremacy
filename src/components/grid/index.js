import React from 'react'
import { useRecoilValue } from 'recoil'
import { selectPlanets } from '../../state/planets'
import { selectPlayerShips } from '../../state/ships'
import './styles.css'

const Grid = props => {
	const rows = []
		console.log("***")
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
				cell = (<td key={index} title={item.name + " (" + item.type + ")"} onClick={e => props.onSelectItem(item)}>{item.name}</td>)
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

export const PlanetGrid = props => {
	const planets = useRecoilValue(selectPlanets)
	return (<Grid items={planets} {...props} />)
}

export const PlayerFleetGrid = props => {
	const ships = useRecoilValue(selectPlayerShips)
	return (<Grid items={ships} {...props} />)
}

export default Grid
