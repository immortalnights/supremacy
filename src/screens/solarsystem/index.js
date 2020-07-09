import React from 'react'
import { useRecoilValue } from 'recoil'
import store from '../../state/atoms'
import { A } from '../../state/nav'

const SolarSystem = props => {
	const game = useRecoilValue(store.game);

	const focusPlanet = game.planets[game.planets.length - 1]

	return (<div>
		<div>Solar System</div>
		<ul>
			{game.planets.map(id => (
				<li key={id}>
					<A href={'overview/' + id} screen="overview" planet={id}>{id}</A>
				</li>
			))}
		</ul>

		<div style={{ display: 'none' }}>
			<A href={'overview/' + focusPlanet} screen="overview" planet={focusPlanet}>Overview</A>
			<A href={'shipyard/' + focusPlanet} screen="shipyard" planet={focusPlanet}>Shipyard</A>
			<A href={'fleet/' + focusPlanet} screen="fleet" planet={focusPlanet}>Fleet</A>
			<button>Scan</button>
			<A href={'training/' + focusPlanet} screen="training" planet={focusPlanet}>Training</A>
			<A href={'cargo/' + focusPlanet} screen="cargo" planet={focusPlanet}>Cargo</A>
			<A href={'surface/' + focusPlanet} screen="surface" planet={focusPlanet}>Surface</A>
			<button>Spy</button>
			<button>Save</button>
		</div>
	</div>)
}

export default SolarSystem
