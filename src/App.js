import React, { useState, useEffect } from 'react'
import { RecoilRoot, useRecoilValue, useTransactionObservation_UNSTABLE } from 'recoil'
// import { useRoutes } from 'hookrouter'
import { useRouter, useMatchmakingRouter } from 'seventh-component-library'
import { random } from './logic/general'
import newGameState from './state/newgamestate'
import initializeState from './state/initializestate'
import { usePersistentState, getLocalStorageValue } from './state/persistentstate'
import Content from './content'
import Button from './components/button'
import Navigation from './components/navigation'
import { viewAtom } from './state/nav'
import Tick from './logic/tick'
import AI from './logic/ai'
import './App.css'


const PersistenceObserver = props => {
	console.log("PersistenceObserver", props)
	useTransactionObservation_UNSTABLE(({ atomValues, atomInfo, modifiedAtoms }) => {
		const data = {}
		atomValues.forEach((item, key) => {
			data[key] = item
		})

		window.localStorage.setItem('savegame_' + props.slot, JSON.stringify(data));
	});

	return null;
}

const Game = props => {
	const view = useRecoilValue(viewAtom)

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

	console.log("Game selected,", selected)
	return (
		<React.Fragment>
			<Tick />
			<AI />
			<Content {...view} />
			<Navigation planet={selected} screen={view.screen} />
		</React.Fragment>
	)
}

const initialGameState = gameOptions => {
	let newGameData
	let saveGameData
	switch (gameOptions.action)
	{
		case 'new':
		{
			newGameData = newGameState(gameOptions)
			break
		}
		case 'load':
		{
			saveGameData = getLocalStorageValue('savegame_' + gameOptions.slot)
			break
		}
		default:
		{
			throw ("Invalid action")
			break
		}
	}

	return ({ set }) => initializeState(set, newGameData, saveGameData)
}

const GameRoot = props => {
	console.log("GameRoot", props)
	const initialState = initialGameState(props)

	return (
		<RecoilRoot initializeState={initialState}>
			<PersistenceObserver slot={props.slot} />
			<Game />
		</RecoilRoot>
	)
}

const MainMenu = props => {
	return (
		<div className="main-menu">
			<h2>Supremacy</h2>
			<div><Button disabled={!props.canContinue} onClick={props.onContinueGame}>Continue</Button></div>
			<div><Button onClick={props.onNewGame}>New Game</Button></div>
			<div><Button disabled={true}>Multiplayer</Button></div>
			<div><Button disabled={true}>Load Game</Button></div>
		</div>
	)
}

function App() {
	let pathName = window.location.pathname
	const url = pathName.match(/\/game\/([\w_]+)?/, '')

	const [ playOptions, setPlayOptions ] = useState(null)
	const [ slot, setSlot ] = usePersistentState('slot', null)

	const onNewGame = () => {
		const newGameSlot = 'slot_1'
		setSlot(newGameSlot)
		setPlayOptions({ action: 'new', slot })
	}

	const onContinueGame = () => {
		setPlayOptions({ action: 'load', slot })
	}

	let content;
	if (url && url[1] === '0')
	{
		content = <GameRoot {...{ action: 'load', slot: 'slot_1' }} />
	}
	else if (playOptions)
	{
		content = <GameRoot {...playOptions} />
	}
	else
	{
		content = (<MainMenu onNewGame={onNewGame} canContinue={slot} onContinueGame={onContinueGame} />)
	}

	return (<div className="content">{content}</div>)
}

export default App
