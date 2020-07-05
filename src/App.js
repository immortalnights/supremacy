import React, { useEffect, useState } from 'react'
import { RecoilRoot, useRecoilState, useRecoilSnapshot } from 'recoil'
import { useRoutes, A } from 'hookrouter'
import { useRouter, useMatchmakingRouter } from 'seventh-component-library'
import initializeState from './state/initialState'
import store from './state/store'
import nav from './state/nav'
import SolarSystem from './screens/solarsystem/'
import Overview from './screens/overview/'
import './App.css'

const Tick = props => {
	// const [date, setDate] = useRecoilState(store.date);
	const [planet, setPlanet] = useRecoilState(store.planets('a'));

	// useEffect(() => {
	// 	setTimeout(() => {
	// 		console.log(date)
	// 		const newDate = { ...date }
	// 		newDate.m = newDate.m + 1
	// 		setDate(newDate)
	// 	}, 1000)
	// }, [date, setDate])

	// modify planet 0 should not cause the players planet (0) to re-render
	useEffect(() => {
		setTimeout(() => {
			const clone = { ...planet };
			clone.population = clone.population + 1
			setPlanet(clone)
		}, 1000)
	}, [planet, setPlanet])

	return false
}

const Game = (props) => {
	const [view, setView] = useRecoilState(nav.view);

	const routes = {
		'/': () => (<SolarSystem />),
		'/combat/:planet': ({planet}) => (<div>combat {planet}</div>),
		'/dock/:planet': ({planet}) => (<div>dock {planet}</div>),
		'/fleet/:planet': ({planet}) => (<div>fleet {planet}</div>),
		'/overview/:planet': ({planet}) => (<Overview id={planet} />),
		'/shipyard/:planet': ({planet}) => (<div>shipyard {planet}</div>),
		'/surface/:planet': ({planet}) => (<div>surface {planet}</div>),
		'/training/:planet': ({planet}) => (<div>training {planet}</div>)
	}

	// const content = useRoutes(routes)

	let content;
	console.log(view.screen)
	switch (view.screen)
	{
		case 'solarsystem':
		{
			content = (<SolarSystem />)
			break
		}
		case 'combat':
		{
			content = (<div>combat {view.planet}</div>)
			break
		}
		case 'dock':
		{
			content = (<div>dock {view.planet}</div>)
			break
		}
		case 'fleet':
		{
			content = (<div>fleet {view.planet}</div>)
			break
		}
		case 'overview':
		{
			content = (<Overview id={view.planet} />)
			break
		}
		case 'shipyard':
		{
			content = (<div>shipyard {view.planet}</div>)
			break
		}
		case 'surface':
		{
			content = (<div>surface {view.planet}</div>)
			break
		}
		case 'training':
		{
			content = (<div>training {view.planet}</div>)
			break
		}
		default:
		{
			content = (<div>Not Found</div>)
		}
	}

	return (<React.Fragment><Tick />{content}</React.Fragment>)
}

function App() {
	console.log("App.render")
	const content = useMatchmakingRouter(undefined, undefined, Game)

	return (
		<RecoilRoot initializeState={initializeState}>
			<React.Fragment>{content}</React.Fragment>
		</RecoilRoot>
	)
}

export default App
