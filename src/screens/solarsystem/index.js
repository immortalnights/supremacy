import React from 'react'
import { useRecoilValue } from 'recoil'
import { A } from 'hookrouter'
import store from '../../state/store'

const SolarSystem = props => {
	const game = useRecoilValue(store.game);

	return (<div>
		<div>Solar System</div>
		<ul>
			{game.planets.map(id => (<li key={id}><a href={'overview/' + id}>{id}</a></li>))}
		</ul>
	</div>)
}

export default SolarSystem
