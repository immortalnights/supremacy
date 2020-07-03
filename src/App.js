import React, { useEffect, useReducer } from 'react'
import { RecoilRoot, useRecoilState, useRecoilSnapshot } from 'recoil'
import { useRouter, useMatchmakingRouter } from 'seventh-component-library'
import initializeState from './state/initialState'
import store from './state/store'
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
	// const snapshot = useRecoilSnapshot()
	// console.log("State", snapshot.getLoadable(store.planets).contents)

	const content = useRouter({
		routes: {
			'/': () => (<SolarSystem />),
			'/combat/:planet': ({planet}) => (<div>combat {planet}</div>),
			'/dock/:planet': ({planet}) => (<div>dock {planet}</div>),
			'/fleet/:planet': ({planet}) => (<div>fleet {planet}</div>),
			'/overview/:planet': ({planet}) => (<Overview id={planet} />),
			'/shipyard/:planet': ({planet}) => (<div>shipyard {planet}</div>),
			'/surface/:planet': ({planet}) => (<div>surface {planet}</div>),
			'/training/:planet': ({planet}) => (<div>training {planet}</div>)
		}
	})

	return (<React.Fragment><Tick />{content}</React.Fragment>)
}

function App() {
	const content = useMatchmakingRouter(undefined, undefined, Game)


	return (
		<RecoilRoot initializeState={initializeState}>
			<React.Fragment>{content}</React.Fragment>
		</RecoilRoot>
	)
}

export default App
