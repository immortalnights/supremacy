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
import { io, Socket } from "socket.io-client"
import "./App.css"

const theme = createTheme()

interface ClientToServerEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: number[]) => void;
}

interface ServerToClientEvents {
  withAck: (d: string, cb: (e: number) => void) => void;
}

type SocketIO = Socket<ServerToClientEvents, ClientToServerEvents> | undefined

const IOContext = React.createContext<SocketIO>(undefined)

const Planet = ({ name, type, population }: { name: string, type: PlanetType, population: number }) => {
  return (
    <li>
      {name} {type} {Math.floor(population)}
    </li>
  )
}

const PlanetList = () => {
  const [ selected, setSelected ] = React.useState<string | undefined>(undefined)
  const planets = Recoil.useRecoilValue(planetsAtom)

  return (
    <ul>
      {planets.map((planet) => <Planet key={planet.id} {...planet} />)}
    </ul>
  )
}

const planetsAtom = Recoil.atom<IPlanet[]>({
  key: "morePlanets",
  default: []
})

const IOProvider = ({ children }: { children: JSX.Element }) => {
  const [ socket, setSocket ] = React.useState<SocketIO>(undefined)
  const handleMessage = Recoil.useRecoilTransaction_UNSTABLE(( { get, set }) => (action: string, data: any) => {
    // console.log(data)
    set(planetsAtom, data)
  })

  React.useEffect(() => {
    console.log("Creating Socket.IO")
    const socket = io("http://localhost:3000", {
      transports: ["websocket"]
    })

    socket.on("connect_error", (err) => {
      console.log("connection error", err)
    })
    socket.on("connect", () => {
      console.log("client connected")
    })
    socket.on("disconnect", () => {
      console.log("client disconnected")
    })
    socket.on("planets", (body) => {
      console.log("received", "planets")
      handleMessage("planets", body)
    })

    setSocket(socket)
    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <IOContext.Provider value={socket}>
      {children}
    </IOContext.Provider>
  )
}


const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Recoil.RecoilRoot initializeState={() => {}}>
        <IOProvider>
          <Container maxWidth="lg">
            <Typography component="h1" align="center">Supremacy</Typography>
            <Container component="main" maxWidth="lg">
              <PlanetList />
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
        </IOProvider>
      </Recoil.RecoilRoot>
    </ThemeProvider>
  )
}

export default App
