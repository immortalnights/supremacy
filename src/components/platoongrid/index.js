import React from 'react'
import { useRecoilValue } from 'recoil'
import { selectPlatoons } from '../../state/platoons'
import './styles.css'

const Platoon = props => {

	const onClick = () => {
		if (props.name)
		{
			props.onClick(props)
		}
	}

	return (
		<React.Fragment>
			<td className="platoon-name" onClick={onClick}>{props.name}</td>
			<td className="platoon-troops" onClick={onClick}>{props.troops}</td>
		</React.Fragment>
	)
}

const PlatoonGrid = props => {
	const maxRows = props.rows
	const maxCols = props.cols

	const rows = []
	for (let row = 0; row < maxRows; row++)
	{
		const columns = []
		for (let col = 0; col < maxCols; col++)
		{
			const index = (col * 8) + row
			columns.push(<Platoon key={index} {...props.platoons[index]} onClick={props.onSelect} />)

			if (maxCols > 1 && col < maxCols - 1)
			{
				columns.push(<td key={index + 1} className="spacer"></td>)
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

PlatoonGrid.defaultProps = {
	rows: 4,
	cols: 1,
	onSelect: () => {},
	items: [],
}

export const ShipPlatoons = props => {
	const platoons = useRecoilValue(selectPlatoons({ ship: props.ship || -1, commissioned: true }))
	return (<PlatoonGrid rows={4} cols={1} platoons={platoons} onSelect={props.onSelect} />)
}

export const PlanetPlatoons = props => {
	const platoons = useRecoilValue(selectPlatoons({ planet: props.planet, commissioned: true }))
	return (<PlatoonGrid rows={8} cols={3} platoons={platoons} onSelect={props.onSelect} />)
}

export default PlatoonGrid