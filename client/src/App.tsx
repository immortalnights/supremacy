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
} from "react-router-dom"
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
      </Recoil.RecoilRoot>
    </ThemeProvider>
  )
}

export default App
