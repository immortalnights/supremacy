import React from 'react'
import {} from 'recoil'
import './styles.css'

const Platoon = props => {
	return (
		<React.Fragment>
			<td>{props.name}</td>
			<td>{props.troops}</td>
		</React.Fragment>
	)
}

const PlatoonGrid = props => {
	const maxRows = props.rows || 4
	const maxCols = props.cols || 1

	console.log(maxRows, maxCols)

	const rows = []
	for (let row = 0; row < maxRows; row++)
	{
		const columns = []
		for (let col = 0; col < maxCols; col++)
		{
			columns.push(<Platoon />)

			if (maxCols > 1 && col < maxCols - 1)
			{
				columns.push(<td className="spacer"></td>)
			}
		}

		rows.push(
			<tr key={row}>
				{columns}
			</tr>
		)
	}

	return (
		<table className="platoon grid">
			<tbody>{rows}</tbody>
		</table>
	)
}

export const ShipPlatoons = props => {
	return (<PlatoonGrid rows={4} cols={1} />)
}

export const PlanetPlatoons = props => {
	return (<PlatoonGrid rows={8} cols={3} />)
}

export default PlatoonGrid