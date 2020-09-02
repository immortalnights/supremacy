import React from 'react'
import { useRecoilValue } from 'recoil'
import store from '../../state/atoms'
import { useNavigate } from '../../state/nav'
import StarDate from '../../components/date'
import './styles.css'

const PlanetList = props => {
	const game = useRecoilValue(store.game)
	const navigate = useNavigate()

	return (
		<ul className="planet-list">
			{game.planets.map(id => (
				<li key={id} className={props.selected === id ? 'selected' : ''} onDoubleClick={() => navigate('overview', id)} onClick={() => navigate('solarsystem', id)}>
					<Planet planet={id} />
				</li>
			))}
		</ul>
	)
}

const Planet = props => {
	const planet = useRecoilValue(store.planets(props.planet))

	return (
		<div className={planet.habitable ? "" : "lifeless"} >{planet.name || "Lifeless Planet"}</div>
	)
}

const SolarSystem = props => {

	let displayName = props.planet.terraforming ? "Formatting" : (props.planet.name || "Lifeless")
	let displayType
	if (!props.planet.habitable)
	{
		displayType = "lifeless"
	}
	else if (props.planet.owner === props.player.id)
	{
		displayType = props.planet.type
	}
	else
	{
		displayType = "classified"
	}

	return (
		<div className="flex-columns">
			<PlanetList selected={props.planet.id} />
			<div>
				<StarDate />
				<div><img src="" alt={displayType} /></div>
				<div>{displayName}</div>
			</div>
		</div>
	)
}

export default SolarSystem
