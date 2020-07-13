import React from 'react'
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil'
// import { useRoutes } from 'hookrouter'
import { useRouter, useMatchmakingRouter } from 'seventh-component-library'
import initializeState from './state/initialState'
import atoms from './state/atoms'
import store from './state/atoms'
import { viewAtom, A } from './state/nav'
import { selectPopulatedPlanets } from './state/planets'
import SolarSystem from './screens/solarsystem/'
import Overview from './screens/overview/'
import Shipyard from './screens/shipyard/'
import Fleet from './screens/fleet/'
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
	// useEffect(() => {
	// 	setTimeout(() => {
	// 		const clone = { ...planet };
	// 		clone.population = clone.population + 1
	// 		setPlanet(clone)
	// 	}, 1000)
	// }, [planet, setPlanet])

	return false
}

const Navigation = props => {
	const planet = props.planet || 'h'
	return (
		<nav className="navigation">
			<A screen='solarsystem'>Home</A>
			<A href={'overview/' + planet} screen="overview" planet={planet}>Overview</A>
			<A href={'shipyard/' + planet} screen="shipyard" planet={planet}>Shipyard</A>
			<A href={'fleet/' + planet} screen="fleet" planet={planet}>Fleet</A>
			<A href={'training/' + planet} screen="training" planet={planet}>Training</A>
			<A href={'cargo/' + planet} screen="cargo" planet={planet}>Cargo</A>
			<A href={'surface/' + planet} screen="surface" planet={planet}>Surface</A>
			<A screen='dock' planet={planet}>Dock</A>
		</nav>
	)
}

const Game = (props) => {
	const view = useRecoilValue(viewAtom);
	// may not want the entire planet, as tick updates will cause screen re-render
	const planet = useRecoilValue(atoms.planets(view.planet))
	// console.log("planet", planet)

	const routes = {
		'/': () => (<SolarSystem />),
		'/combat/:planet': ({planet}) => (<div>combat {planet}</div>),
		'/dock/:planet': ({planet}) => (<div>dock {planet}</div>),
		'/fleet/:planet': ({planet}) => (<Fleet id={planet} />),
		'/overview/:planet': ({planet}) => (<Overview id={planet} />),
		'/shipyard/:planet': ({planet}) => (<div>shipyard {planet}</div>),
		'/surface/:planet': ({planet}) => (<div>surface {planet}</div>),
		'/training/:planet': ({planet}) => (<div>training {planet}</div>)
	}

	// const content = useRoutes(routes)

	let content;
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
			content = (<Fleet planet={planet} />)
			break
		}
		case 'overview':
		{
			content = (<Overview id={view.planet} />)
			break
		}
		case 'shipyard':
		{
			content = (<Shipyard id={view.planet} />)
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
			console.error(`Cannot find view ${view.screen}`)
			content = (<div>Not Found</div>)
		}
	}

	return (<React.Fragment><Tick />{content}<Navigation planet={view.planet} /></React.Fragment>)
}

const MockBrowser = props => {
	return (<div><a href="/game/0">Game</a></div>)
}

function App() {
	console.log("App.render")
	const content = useMatchmakingRouter(MockBrowser, undefined, Game)

	return (
		<RecoilRoot initializeState={initializeState}>
			<React.Fragment>{content}</React.Fragment>
		</RecoilRoot>
	)
}

export default App
