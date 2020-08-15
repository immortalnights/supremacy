import React from 'react'
import { A } from '../state/nav'
import Button from './button'

const Navigation = props => {
	const planet = props.planet || 'h'
	const onSolarSystem = props.screen === 'solarsystem'

	return (
		<nav className="navigation">
			<A href={'solarsystem/' + planet} screen='solarsystem' planet={planet}>Home</A>
			<A href={'overview/' + planet} screen="overview" planet={planet}>Overview</A>
			<A href={'shipyard/' + planet} screen="shipyard" planet={planet}>Shipyard</A>
			<A href={'fleet/' + planet} screen="fleet" planet={planet}>Fleet</A>
			<Button onClick={props.onClickTerraform} disabled={!onSolarSystem}>Terraform</Button>
			<A href={'training/' + planet} screen="training" planet={planet}>Training</A>
			<A href={'dock/' + planet} screen="dock" planet={planet}>Dock</A>
			<A href={'surface/' + planet} screen="surface" planet={planet}>Surface</A>
			<A href={'combat/' + planet} screen="combat" planet={planet}>Combat</A>
			<Button onClick={props.onClickEspionage} disabled={!onSolarSystem}>Espionage</Button>
		</nav>
	)
}

export default Navigation