import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import store from '../../state/atoms'
import { A, useNavigate } from '../../state/nav'

const SolarSystem = props => {
	const game = useRecoilValue(store.game)
	const navigate = useNavigate()

	return (<div>
		<div>Solar System</div>
		<ul>
			{game.planets.map(id => (
				<li key={id}>
					<div onDoubleClick={() => navigate('overview', id)} onClick={() => props.onSelectPlanet(id)} style={{borderWidth: '1px', borderColor: 'blue', borderStyle: id === props.planet ? 'solid' : 'none'}}>{id}</div>
				</li>
			))}
		</ul>
	</div>)
}

export default SolarSystem
