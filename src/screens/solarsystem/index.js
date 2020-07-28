import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import store from '../../state/atoms'
import { A, useNavigate } from '../../state/nav'
import StarDate from '../../components/date'
import './styles.css'

const Planet = props => {
	const planet = useRecoilValue(store.planets(props.id))

	return (
		<div>{planet.name || "Lifeless Planet"}</div>
	)
}

const SolarSystem = props => {
	const game = useRecoilValue(store.game)
	const navigate = useNavigate()

	return (<div className="flex-columns">
		<div>
			<ul className="planet-list">
				{game.planets.map(id => (
					<li key={id} className={props.planet === id ? 'selected' : ''} onDoubleClick={() => navigate('overview', id)} onClick={() => navigate('solarsystem', id)}>
						<Planet id={id} />
					</li>
				))}
			</ul>
		</div>
		<div>
			<StarDate />
		</div>
	</div>)
}

export default SolarSystem
