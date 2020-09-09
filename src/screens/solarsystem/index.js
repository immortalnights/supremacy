import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import StarDate from '../../components/date'
import Button from '../../components/button'
import InlineName from '../../components/inlinename/'
import store from '../../state/atoms'
import { selectLocalPlayer } from '../../state/game'
import { selectPlayerAtmos, useSendAtmos } from '../../state/ships'
import { useNavigate } from '../../state/nav'
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

	return (
		<li className={className.join(' ')} onDoubleClick={() => navigate('overview', planet.id)} onClick={() => navigate('solarsystem', planet.id)}><label>{name}</label> {terraforming}</li>
	)
}

const SolarSystem = props => {
	const player = useRecoilValue(selectLocalPlayer)
	const sendAtmos = useSendAtmos(player)
	const atmos = useRecoilValue(selectPlayerAtmos(player))
	const [ terraforming, setTerraforming ] = useState(false)

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
		setTerraforming(true)
	}

	const onClickEspionage = () => {
		// 
	}

	const onConfirmTerraform = name => {
		debugger
		sendAtmos({ id: props.planet.id }, name )
		setTerraforming(false)
	}

	const onCancelTerraform = () => {
		setTerraforming(false)
	}

	const canTerraform = atmos && props.planet.owner === null
	const canSpy = props.planet.owner !== null && props.planet.owner !== player.id

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
			<PlanetList selected={props.planet.id} />
			<div className="flex flex-rows">
				<div style={{textAlign: 'center'}}>
					<StarDate />
					<div><img src="" alt={displayType} /></div>
					<div>{displayName}</div>
				</div>
				<div className="flex-spacer"></div>
				<div>
					{terraforming ? <TerraformComponent /> : ""}
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
