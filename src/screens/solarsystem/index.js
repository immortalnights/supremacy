import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import StarDate from '../../components/date'
import Button from '../../components/button'
import InlineName from '../../components/inlinename/'
import store from '../../state/atoms'
import { selectLocalPlayer } from '../../state/game'
import { selectPlayerAtmos, useSendAtmos } from '../../state/ships'
import { useNavigate } from '../../state/nav'
import Espionage from './espionage'
import './styles.css'

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

	let name
	if (planet.habitable)
	{
		name = planet.name || "Unnamed Planet"
	}
	else
	{
		name = "Lifeless Planet"
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

	const onSelectPlanet = () => {
		if (!props.locked)
		{
			navigate('solarsystem', planet.id)
		}
	}

	const onGoToPlanet = () => {
		if (!props.locked)
		{
			navigate('overview', planet.id)
		}
	}

	return (
		<li className={className.join(' ')} onDoubleClick={onGoToPlanet} onClick={onSelectPlanet}><label>{name}</label> {terraforming}</li>
	)
}

const PlanetList = props => {
	const game = useRecoilValue(store.game)

	return (
		<ul className="planet-list">
			{game.planets.map(id => {
				return (<Planet key={id} planet={id} selected={props.selected === id} locked={props.locked} />)
			})}
		</ul>
	)
}

const SolarSystem = props => {
	const player = useRecoilValue(selectLocalPlayer)
	const sendAtmos = useSendAtmos(player)
	const atmos = useRecoilValue(selectPlayerAtmos(player))
	const [ action, setAction ] = useState(null)

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

	const onClickTerraform = () => {
		setAction('terraform')
	}

	const onConfirmTerraform = name => {
		sendAtmos({ id: props.planet.id }, name )
		setAction(null)
	}

	const onCancelTerraform = () => {
		setAction(null)
	}

	const onClickEspionage = () => {
		setAction('espionage')
	}

	const onCancelEspionage = () => {
		setAction(null)
	}

	const canTerraform = atmos && props.planet.owner === null
	const canSpy = action !== 'espionage' && props.planet.owner !== null && props.planet.owner !== player.id

	let TerraformComponent = null
	if (canTerraform)
	{
		const defaultPlanetName = "Planet 1"

		TerraformComponent = () => (
			<div style={{margin: '0 0 10px'}}>
				<InlineName message="Planet name" value={defaultPlanetName} onCancel={onCancelTerraform} onComplete={onConfirmTerraform} />
			</div>
		)
	}

	return (
		<div className="flex-columns">
			<PlanetList selected={props.planet.id} locked={!!action}/>
			<div className="flex flex-rows">
				<div style={{textAlign: 'center'}}>
					<StarDate />
					<div><img src="" alt={displayType} /></div>
					<div>{displayName}</div>
				</div>
				<div className="flex-spacer"></div>
				<div>
					{action === 'espionage' ? <Espionage onCancel={onCancelEspionage} /> : ""}
					{action === 'terraform' ? <TerraformComponent /> : ""}
					<div className="flex space-around" style={{textAlign: 'center', margin: '0 10px 20px'}}>
						<Button onClick={onClickTerraform} disabled={!canTerraform}>Terraform</Button>
						<div style={{flexBasis: '10%', flexGrow: 0}}></div>
						<Button onClick={onClickEspionage} disabled={!canSpy}>Espionage</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SolarSystem
