import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { selectPlayerShips } from '../../state/ships'

const Grid = props => {

	const rows = []
	for (let rowIndex = 0; rowIndex < 8; rowIndex++)
	{
		const row = []
		for (let colIndex = 0; colIndex < 4; colIndex++)
		{
			const index = (colIndex * 4) + rowIndex
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

const Fleet = props => {
	const ships = useRecoilValue(selectPlayerShips)
	const [ selected, setSelected ] = useState(null)
	const onSelectItem = ship => {
		console.log(ship)
	}

	return (
		<div>
			<div>ships {props.id}</div>
			<Grid items={ships} onSelectItem={onSelectItem} />
		</div>
	)
}

export default Fleet