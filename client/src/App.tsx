import React from "react"
import {
  Grid,
  CssBaseline,
  ThemeProvider,
  Typography,
  Container,
  createTheme,
} from "@mui/material"
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"
import DataProvider from "./DataProvider"
import Menu from "./screens/Menu"
import Setup from "./screens/Setup"
import GameRoot from "./screens/Game/Root"
import ConnectionStatus from "./lobby/ConnectionStatus"
import "./App.css"

const theme = createTheme()

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
            <BrowserRouter>
      <DataProvider>
        <Container maxWidth="lg">
          <Grid container>
            <Grid item xs={2} />
            <Grid item xs={8}><Typography component="h1" align="center">Supremacy</Typography></Grid>
            <Grid item xs={2}><ConnectionStatus /></Grid>
          </Grid>
          <Container component="main" maxWidth="lg">
              <Routes>
                <Route index element={<Menu />} />
                <Route path="/setup" element={<Setup />}>
                  <Route path=":id" element={<Setup />} />
                </Route>
                <Route path="/play/:id/*" element={<GameRoot />} />
                <Route path="*" element={
                  <div>404</div>
                } />
              </Routes>
          </Container>
        </Container>
      </DataProvider>
            </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
