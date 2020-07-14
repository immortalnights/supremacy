import React from 'react'
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil'
// import { useRoutes } from 'hookrouter'
import { useRouter, useMatchmakingRouter } from 'seventh-component-library'
import initializeState from './state/initialState'
import atoms from './state/atoms'
import store from './state/atoms'
import { viewAtom, A } from './state/nav'
import { selectPopulatedPlanets } from './state/planets'
import SolarSystem from './screens/solarsystem'
import Overview from './screens/overview'
import Shipyard from './screens/shipyard'
import Fleet from './screens/fleet'
import Training from './screens/training'
import Dock from './screens/dock'
import Surface from './screens/surface'
import Combat from './screens/combat'
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
			<A href={'solarsystem/'} screen='solarsystem'>Home</A>
			<A href={'overview/' + planet} screen="overview" planet={planet}>Overview</A>
			<A href={'shipyard/' + planet} screen="shipyard" planet={planet}>Shipyard</A>
			<A href={'fleet/' + planet} screen="fleet" planet={planet}>Fleet</A>
			<A href={'training/' + planet} screen="training" planet={planet}>Training</A>
			<A href={'dock/' + planet} screen="dock" planet={planet}>Dock</A>
			<A href={'surface/' + planet} screen="surface" planet={planet}>Surface</A>
			<A href={'combat/' + planet} screen="combat" planet={planet}>Combat</A>
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
		'/overview/:planet': ({planet}) => (<Overview planet={planet} />),
		'/shipyard/:planet': ({planet}) => (<Shipyard planet={planet} />),
		'/fleet/:planet': ({planet}) => (<Fleet planet={planet} />),
		'/training/:planet': ({planet}) => (<Training planet={planet} />),
		'/dock/:planet': ({planet}) => (<Dock planet={planet} />),
		'/surface/:planet': ({planet}) => (<Surface planet={planet} />),
		'/combat/:planet': ({planet}) => (<Combat planet={planet} />)
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
		case 'overview':
		{
			content = (<Overview planet={view.planet} />)
			break
		}
		case 'shipyard':
		{
			content = (<Shipyard planet={view.planet} />)
			break
		}
		case 'fleet':
		{
			content = (<Fleet planet={view.planet} />)
			break
		}
		case 'training':
		{
			content = (<Training planet={view.planet} />)
			break
		}
		case 'dock':
		{
			content = (<Dock planet={view.planet} />)
			break
		}
		case 'surface':
		{
			content = (<Surface planet={view.planet} />)
			break
		}
		case 'combat':
		{
			content = (<Combat planet={view.planet} />)
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
