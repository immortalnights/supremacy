import React from "react"
import Recoil from "recoil"
import {
  Grid,
  Button,
  CssBaseline,
  ThemeProvider,
  Typography,
  Container,
  createTheme,
  Stack,
} from "@mui/material"
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom"
import { GameContextProvider, useGameContext, initializeFn } from "./GameContext"
import { DGame, planetsSelector, planetSelector } from "./data"
import { IUniverse } from "./simulation/types.d"
import { saveGameState } from "./saveGameState"
import "./App.css"

const theme = createTheme()

const useLocalStorageValue = (key: string) => {
  const value = localStorage.getItem(key)
  return value
}

const QuitGame = () => {
  const reset = Recoil.useResetRecoilState(DGame)
  const context = useGameContext()

  React.useEffect(() => {
    reset()
    context.postMessage({
      type: "QUIT",
    })
  }, [])

  return (<Navigate to="/" replace />)
}

const MainMenu = () => {
  const game = Recoil.useRecoilValue(DGame)
  const context = useGameContext()
  const saveGameId = useLocalStorageValue("game_id")
  const navigate = useNavigate()

  const handleContinueClick = () => {
    navigate(`/setup/${saveGameId}`)
  }

  const handleNewGameClick = () => {
    navigate("/setup")
  }

  const handleHostGameClick = () => {
    navigate("/setup/?multiplayer=true")
  }

  let content
  if (game && game.id) // || context.initialized)
  {
    content = (<QuitGame />)
  }
  else
  {
    content = (
      <Stack>
        <Button onClick={handleContinueClick} disabled={!(saveGameId)}>Continue</Button>
        <Button onClick={handleNewGameClick} >New Game</Button>
        <Button onClick={handleHostGameClick} disabled>Host Game</Button>
      </Stack>
    )
  }

  return content
}

const Setup = () => {
  const context = useGameContext()
  const game = Recoil.useRecoilValue(DGame)
  const params = useParams()
  const navigate = useNavigate()

  console.log("context in Setup", context)
  React.useEffect(() => {
    let saveGameData
    if (params.id)
    {
      const value = localStorage.getItem("game")
      saveGameData = value ? JSON.parse(value) : undefined
      console.assert(Number(params.id) === saveGameData.id, "Save game data ID mismatch")
    }

    (context.initialize as initializeFn)(saveGameData)
  }, [])

  React.useEffect(() => {
    if (game)
    {
      console.log("Setup complete, navigate to game")
      navigate(`/play/${game.id}`, { replace: true })
    }
  }, [ game ])

  return (
    <div>setup</div>
  )
}

const Planet = ({ id }: { id: number }) => {
	const p = Recoil.useRecoilValue(planetSelector(id))
	const [ c, setC ] = React.useState(0)

	React.useEffect(() => {
		const r = c + 1
		setC(r)
	}, [p])

  let content
  if (!p)
  {
    content = <div>Planet {id} not found</div>
  }
  else
  {
		content = (<div>Planet {p.id} - {p.population} ({c})</div>)

  }

	return content
}

const Game = () => {
	const planets = Recoil.useRecoilValue(planetsSelector)

	return (
		<div>
			<ul>
				{planets.map(p => <div key={p.id}>Planet {p.id}</div>)}
			</ul>
			<Planet id={0} />
			<Planet id={1} />
		</div>
	)
}

const GameRoot = () => {
  const game = Recoil.useRecoilValue(DGame)
  const saveCallback = Recoil.useRecoilCallback(({ snapshot, set }) => () => {
    const game = snapshot.getLoadable(DGame).contents
    localStorage.setItem("game_id", game.id)
    localStorage.setItem("game", JSON.stringify(game))

    set(saveGameState, {
      state: "",
      lastSaved: Date.now(),
    })
  })

  React.useEffect(() => {
    const saveInterval = setInterval(() => {
      saveCallback()
    }, 5000)

    return () => {
      clearInterval(saveInterval)
    }
  }, [])

  let content

  if (!game || !game.id)
  {
    console.warn("No game state data, redirect to main menu")
    content = (<Navigate to="/" replace />)
  }
  else
  {
    content = (<Game />)
  }

  return content
}


const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Recoil.RecoilRoot initializeState={() => {}}>
        <GameContextProvider>
          <Container maxWidth="md">
            <Typography component="h1" align="center">Supremacy</Typography>
            <Container component="main" maxWidth="sm">
              <BrowserRouter>
                <Routes>
                  <Route index element={<MainMenu />} />
                  <Route path="/setup" element={<Setup />}>
                    <Route path=":id" element={<Setup />} />
                  </Route>
                  <Route path="/play/:id" element={<GameRoot />} />
                  <Route path="*" element={
                    <div>404</div>
                  } />
                </Routes>
              </BrowserRouter>
            </Container>
          </Container>
        </GameContextProvider>
      </Recoil.RecoilRoot>
    </ThemeProvider>
  )
}

export default App
