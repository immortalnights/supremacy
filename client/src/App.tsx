import React from "react"
import {
  Grid,
  CssBaseline,
  ThemeProvider,
  Typography,
  Container,
  Box,
  createTheme,
} from "@mui/material"
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"
import DataProvider from "./DataProvider"
import ConnectionStatus from "./lobby/ConnectionStatus"
import { IOContext } from "./data/IOContext"
import Menu from "./screens/Menu"
import Setup from "./screens/Setup"
import Browse from "./screens/Browse"
import Room from "./screens/Room"
import Game from "./screens/Game"
import "./App.css"

const theme = createTheme()

const Content = () => {
  const { connected } = React.useContext(IOContext)

  let content
  if (connected())
  {
    content = (
      <Routes>
        <Route index element={<Menu />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/room/:id" element={<Room />} />
        <Route path="/game/:id/*" element={<Game />} />
        <Route path="*" element={
          <div>404</div>
        } />
      </Routes>
    )
  }
  else
  {
    content = (
      <Typography align="center">Connecting, please wait...</Typography>
    )
  }

  return content
}

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <DataProvider>
          <>
            <Box sx={{ flexGrow: 0 }}><ConnectionStatus /></Box>
            <Container component="header" maxWidth="lg" sx={{ flexGrow: 0 }}>
              <Grid container>
                <Grid item xs={2} />
                <Grid item xs={8}><Typography component="h1" align="center">Supremacy</Typography></Grid>
                <Grid item xs={2} />
              </Grid>
            </Container>
            <Container component="main" sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <Content />
            </Container>
          </>
        </DataProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
