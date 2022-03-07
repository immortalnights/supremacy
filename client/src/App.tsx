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
import Menu from "./screens/Menu"
import GameRoot from "./screens/Game/Root"
import Setup from "./screens/Setup"
import "./App.css"

const theme = createTheme()

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
                  <Route index element={<Menu />} />
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
