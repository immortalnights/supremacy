import React from 'react'
import { useRecoilValue } from 'recoil'
import store from '../../state/atoms'
import { useNavigate } from '../../state/nav'
import StarDate from '../../components/date'
import './styles.css'

const PlanetList = props => {
	const game = useRecoilValue(store.game)

	return (
		<ul className="planet-list">
			{game.planets.map(id => {
				return (<Planet key={id} planet={id} selected={props.selected === id} />)
			})}
		</ul>
	)
}

const Planet = props => {
	const planet = useRecoilValue(store.planets(props.planet))
	const navigate = useNavigate()

	let terraforming;
	if (planet.terraforming)
	{
		terraforming = (<div className="animate-flicker">Terraforming</div>)
	}

	const className = ['flex-columns planet']

	if (props.selected)
	{
		className.push('selected')
	}

	if (!planet.habitable)
	{
		className.push('lifeless')
	}

	// FIXME use proper player IDs
	if (planet.owner !== null)
	{
		if (planet.owner === 0)
		{
			className.push('enemy')
		}
		else
		{
			className.push('friendly')
		}
	}

	return (
		<li className={className.join(' ')} onDoubleClick={() => navigate('overview', planet.id)} onClick={() => navigate('solarsystem', planet.id)}><label>{planet.name || "Lifeless Planet"}</label> {terraforming}</li>
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
