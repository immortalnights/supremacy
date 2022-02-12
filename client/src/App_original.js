import React, { useState, useEffect } from 'react'
import Recoil, { atom, RecoilRoot, selector, selectorFamily, useRecoilValue } from 'recoil'
// import { useRoutes } from 'hookrouter'
import { random } from './logic/general'
// import store from './state/atoms'
// import newGameState from './state/newgamestate'
// import initializeState from './state/initializestate'
import { usePersistentState, getLocalStorageValue } from './state/persistentstate'
import Content from './content'
// import Button from './components/button'
import { Button }from "@mui/material"
import Navigation from './components/navigation'
import { viewAtom } from './state/nav'
// import Tick from './logic/tick'
// import AI from './logic/ai'
import './App.css'

import sup, { Universe, Planet } from "./sup/"

class WebWorker {
  constructor(worker, options) {
    const code = worker.toString();
		console.log(code)
    const blob = new Blob(["(" + code + ")()"]);
    return new Worker(URL.createObjectURL(blob));
  }
}

const PersistenceObserver = props => {
	console.log("PersistenceObserver", props)
	// useTransactionObservation_UNSTABLE(({ atomValues, atomInfo, modifiedAtoms }) => {
	// 	const data = {}
	// 	atomValues.forEach((item, key) => {
	// 		data[key] = item
	// 	})

	// 	window.localStorage.setItem('savegame_' + props.slot, JSON.stringify(data));
	// });

	return null;
}

const GamePlay = props => {
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
			<Content {...view} />
			<Navigation planet={selected} screen={view.screen} />
		</React.Fragment>
	)
}

const GameOver = props => {
	const [ slot, setSlot ] = usePersistentState('slot', null)

	const onExit = () => {
		setSlot(null)
	}

	return (
		<div className="main-menu" style={{textAlign: 'center'}}>
			<div>Game Over</div>
			<div>
				<a href="/" onClick={onExit}>Return to main menu</a>
			</div>
		</div>
	)
}

// const Game = props => {
// 	const game = useRecoilValue(store.game)

// 	let content
// 	if (game.finished)
// 	{
// 		content = (<GameOver {...game} />)
// 	}
// 	else
// 	{
// 		content = (<GamePlay {...props} />)
// 	}

// 	return (content)
// }

const uGameAtom = atom({
	key: "ugame",
	default: {}
})

const uPlanetsSelector = selector({
	key: "uplanets",
	get: ({ get }) => {
		const d = get(uGameAtom)
		return d.planets
	}
})

const uPlanetSelector = selectorFamily({
	key: "uplanet111",
	get: (id) => ({ get }) => {
		const d = get(uGameAtom)
		const planet = d.planets.find(p => p.id === id)
		console.log(d.planets, id, planet)
		return planet
	}
})


const PlanetComponent = ({ id }) => {
	const p = useRecoilValue(uPlanetSelector(id))
	const [ c, setC ] = useState(0)

	useEffect(() => {
		const r = c + 1
		setC(r)
	}, [p])

	return (
		<div>Planet {p.id} - {p.population} ({c})</div>
	)
}

const Game2 = () => {
	const planets = useRecoilValue(uPlanetsSelector)

	return (
		<div>
			<ul>
				{planets.map(p => <div key={p.id}>Planet {p.id}</div>)}
			</ul>
			<PlanetComponent id={0} />
			<PlanetComponent id={1} />
		</div>
	)
}

// const initialGameState = gameOptions => {
// 	let newGameData
// 	let saveGameData
// 	switch (gameOptions.action)
// 	{
// 		case 'new':
// 		{
// 			newGameData = newGameState(gameOptions)
// 			break
// 		}
// 		case 'load':
// 		{
// 			saveGameData = getLocalStorageValue('savegame_' + gameOptions.slot)
// 			break
// 		}
// 		default:
// 		{
// 			throw ("Invalid action")
// 			break
// 		}
// 	}

// 	return ({ set }) => initializeState(set, newGameData, saveGameData)
// }

const GameRoot2 = () => {
	const [ d, setD ] = Recoil.useRecoilState(uGameAtom)
	const callback = Recoil.useRecoilCallback(({ snapshot, set }) => (update) => {
		const data = snapshot.getLoadable(uGameAtom).contents
		console.log(data)

		const d = { ...data }
		d.planets = [ ...d.planets ]
		d.planets[1] = update.planets[1]

		set(uGameAtom, d)
	})

	React.useEffect(() => {
		// const worker = new window.Worker("./supremacy.js", { type: "module" })
		const worker = new WebWorker(sup, { type: "module" })

		worker.postMessage({ type: "START" })
		worker.onmessage = (e) => {
			const msg = e.data

			switch (msg.type)
			{
				case "INITIALIZE":
				{
					setD(msg.data)
					break
				}
				case "UPDATE":
				{
					callback(msg.data)
					break
				}
			}
		}
	}, [])

	return (d ? <Game2 /> : "Loading...")
}

const GameRoot = props => {
	console.log("GameRoot", props)
	const [ loading, setLoading ] = React.useState(true)
	const [ state, setState ] = React.useState(null)

	// const initialState = initialGameState(props)

	return (
		<RecoilRoot initializeState={(snapshot) => snapshot.set(uGameAtom, state)}>
			<GameRoot2 />
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
