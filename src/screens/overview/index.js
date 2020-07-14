import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { Button } from 'seventh-component-library'
import StarDate from '../../components/date'
import { PlanetGrid } from '../../components/grid'
import store from '../../state/atoms'
import { A } from '../../state/nav'
import './styles.css'

const PlanetOverview = props => {
	// const platoons = useRecoilValue(store.platoons)
	const planet = useRecoilValue(store.planets(props.id))

	if (!planet)
	{
		return (<div>Planet {props.id} does not exist</div>)
	}

	return (
		<div>
			<dl>
				<dd>{planet.name}</dd>
				<dt>Planet</dt>
				<dd><StarDate /></dd>
				<dt>Date</dt>
				<dd>{planet.status}</dd>
				<dt>Status</dt>
				<dd>{planet.resources.credits}</dd>
				<dt>Credits</dt>

				<dd>{planet.resources.foodChange} {planet.resources.food} T.</dd>
				<dt>Food</dt>
				<dd>{planet.resources.minerals} T.</dd>
				<dt>Minerals</dt>
				<dd>{planet.resources.fuel} T.</dd>
				<dt>Fuels</dt>
				<dd>{planet.resources.energy} T.</dd>
				<dt>Energy</dt>
			</dl>
			<dl>
				<dd>{planet.population}</dd>
				<dt>Population</dt>
				<dd>{planet.growthChange} {planet.growth} %</dd>
				<dt>Growth</dt>
				<dd>{planet.morale} %</dd>
				<dt>Morale</dt>

				<dd>{planet.tax} %</dd>
				<dt>
					<Button>Inc</Button>
					<Button>Dec</Button>
					<span>Tax Rate</span>
				</dt>

				<dd>{0}</dd>
				<dt>Military Strength</dt>
			</dl>
		</div>
	)
}

const OverviewSurfaceSlots = () => {
	const planet = {}

	return (
		<div>
			<label>Ships on surface of {planet.name}</label>
			Surface Slots
		</div>
	)
}

const Overview = props => {
	return (
		<div>
			<div>
				<Button>Rename</Button>
				<Button>Transfer Credits</Button>
				<PlanetOverview id={props.planet} />
			</div>
			<div>
				<div>Messages</div>
				<div>
					<div>
						<Button>Send to Orbit</Button>
						<Button>Send to Surface</Button>
						<Button>Dock</Button>
					</div>
					<PlanetGrid />
				</div>
			</div>
			<div>
				<div style={{ display: 'none' }}>
					<A screen='training' id={props.planet}>Platoons</A>
					<A screen='fleet' id={props.planet}>Fleet</A>
					<A screen='dock' id={props.planet}>Dock</A>
					<A screen='solarsystem'>Home</A>
				</div>
				<OverviewSurfaceSlots id={props.planet} />
			</div>
		</div>
	)
}

export default Overview

