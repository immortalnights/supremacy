import React from "react"
import Recoil, { useRecoilValue } from "recoil"
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
import { IPlanet, PlanetType } from "./simulation/types"
import IOProvider, { IOContext } from "./data/IOContext"
import "./App.css"
import { Player, Room, IPlayer } from "./data/Room"

const theme = createTheme()

// const Planet = ({ name, type, population }: { name: string, type: PlanetType, population: number }) => {
//   return (
//     <li>
//       {name} {type} {Math.floor(population)}
//     </li>
//   )
// }

// const PlanetList = () => {
//   const [ selected, setSelected ] = React.useState<string | undefined>(undefined)
//   const planets = Recoil.useRecoilValue(planetsAtom)

//   return (
//     <ul>
//       {planets.map((planet) => <Planet key={planet.id} {...planet} />)}
//     </ul>
//   )
// }

// const planetsAtom = Recoil.atom<IPlanet[]>({
//   key: "morePlanets",
//   default: []
// })

const DataProvider = ({ children }: { children: JSX.Element }) => {
  const SocketToRecoil = () => {
    const handleMessage = Recoil.useRecoilTransaction_UNSTABLE(( { get, set }) => (action: string, data: any) => {
      console.log("received", action, data)

      switch (action)
      {
        case "room-joined":
        {
          const isHost = (data.players.find((p: IPlayer) => p.id === data.playerID) as IPlayer).host
          // Copy existing data (to preserve the player name)
          const player = { ...get(Player), id: data.playerID, host: isHost }

          // Set the player data, now with an ID
          set(Player, player)

          // Set the room data
          set(Room, {
            id: data.roomID,
            seed: "",
            players: data.players,
            status: "pending",
          })
          break
        }
        case "room-closed":
        {
          // const room = get(Room)
          // set(Room, {
          //   id: "",
          //   player1: room?.player1 || "",
          //   player2: "",
          //   status: "pending"
          // })
        }
      }

    })

    return (
      <IOProvider handleMessage={handleMessage}>
        {children}
      </IOProvider>
    )
  }

  return (
    <Recoil.RecoilRoot initializeState={() => {}}>
      <SocketToRecoil />
    </Recoil.RecoilRoot>
  )
}

const ConnectionStatus = () => {
  const { status } = React.useContext(IOContext)
  return (
    <span style={{ float: "right" }}>({status})</span>
  )
}

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DataProvider>
        <Container maxWidth="lg">
          <Grid container>
            <Grid item xs={2} />
            <Grid item xs={8}><Typography component="h1" align="center">Supremacy</Typography></Grid>
            <Grid item xs={2}><ConnectionStatus /></Grid>
          </Grid>
          <Container component="main" maxWidth="lg">
            <BrowserRouter>
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
            </BrowserRouter>
          </Container>
        </Container>
      </DataProvider>
    </ThemeProvider>
  )
}

export default App
