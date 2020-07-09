import React from 'react'
import { useRecoilValue } from 'recoil'
import { selectPlayerShips } from '../../state/ships'

const Fleet = props => {
	const ships = useRecoilValue(selectPlayerShips)

	return (
		<div>
			<div>ships {props.id}</div>
			<table></table>
			<div>{ships.map(s => s.id)}</div>
		</div>
	)
}

export default Fleet