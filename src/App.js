import React from 'react'
import { RecoilRoot, useRecoilValue } from 'recoil'
// import { useRoutes } from 'hookrouter'
import { useRouter, useMatchmakingRouter } from 'seventh-component-library'
import initializeState from './state/initialState'
import { useSendAtmos } from './state/ships'
import Content from './content'
import Navigation from './components/navigation'
import { viewAtom } from './state/nav'
import Tick from './logic/tick'
import './App.css'


const Game = (props) => {
	const view = useRecoilValue(viewAtom)
	const sendAtmos = useSendAtmos()

	const selected = view.planet

	// const routes = {
	// 	'/': () => (<SolarSystem />),
	// 	'/overview/:planet': ({planet}) => (<Overview planet={planet} />),
	// 	'/shipyard/:planet': ({planet}) => (<Shipyard planet={planet} />),
	// 	'/fleet/:planet': ({planet}) => (<Fleet planet={planet} />),
	// 	'/training/:planet': ({planet}) => (<Training planet={planet} />),
	// 	'/dock/:planet': ({planet}) => (<Dock planet={planet} />),
	// 	'/surface/:planet': ({planet}) => (<Surface planet={planet} />),
	// 	'/combat/:planet': ({planet}) => (<Combat planet={planet} />)
	// }

	// const content = useRoutes(routes)

	const onClickTerraform = () => {
		sendAtmos({ id: selected })
	}

	const onClickEspionage = () => {
		// 
	}

	return (
		<React.Fragment>
			<Tick />
			<Content {...view} />
			<Navigation planet={selected} screen={view.screen} onClickTerraform={onClickTerraform} onClickEspionage={onClickEspionage} />
		</React.Fragment>
	)
}

const MockBrowser = props => {
	return (<div><a href="/game/0">Game</a></div>)
}

function App() {
	const content = useMatchmakingRouter(MockBrowser, undefined, Game)

	return (
		<RecoilRoot initializeState={initializeState}>
			{content}
		</RecoilRoot>
	)
}

export default App
