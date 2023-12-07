import React from "react"
import { useRecoilValue } from "recoil"
import SolarSystem from "./screens/solarsystem"
import Overview from "./screens/overview"
import Shipyard from "./screens/shipyard"
import Fleet from "./screens/fleet"
import Training from "./screens/training"
import Dock from "./screens/dock"
import Surface from "./screens/surface"
import Combat from "./screens/combat"
import store from "./state/atoms"
import { useNavigate } from "./state/nav"
import { selectLocalPlayer } from "./state/game"

const Content = (props) => {
    const planet = useRecoilValue(store.planets(props.planet))
    const localPlayer = useRecoilValue(selectLocalPlayer)
    const navigate = useNavigate()
    let content

    if (!planet.habitable) {
        switch (props.screen) {
            // FIX navigation recursion to remove switch
            case "solarsystem": {
                content = <SolarSystem planet={planet} player={localPlayer} />
                break
            }
            default: {
                // TODO add error message
                navigate("solarsystem", props.planet)
                // naviage doesn't (currently) prevent the component from rendering
                content = <SolarSystem planet={planet} player={localPlayer} />
                break
            }
        }
    } else if (planet.owner !== localPlayer.id) {
        switch (props.screen) {
            case "solarsystem": {
                content = <SolarSystem planet={planet} player={localPlayer} />
                break
            }
            case "shipyard": {
                content = <Shipyard planet={props.planet} />
                break
            }
            case "combat": {
                content = <Combat planet={props.planet} />
                break
            }
            case "fleet": {
                content = <Fleet planet={props.planet} />
                break
            }
            default: {
                // TODO add error message
                navigate("solarsystem", props.planet)
                // naviage doesn't (currently) prevent the component from rendering
                content = <SolarSystem planet={planet} player={localPlayer} />
                break
            }
        }
    } else {
        switch (props.screen) {
            case "solarsystem": {
                content = <SolarSystem planet={planet} player={localPlayer} />
                break
            }
            case "overview": {
                content = <Overview planet={props.planet} />
                break
            }
            case "shipyard": {
                content = <Shipyard planet={props.planet} />
                break
            }
            case "fleet": {
                content = <Fleet planet={props.planet} />
                break
            }
            case "training": {
                content = <Training planet={props.planet} />
                break
            }
            case "dock": {
                content = <Dock planet={props.planet} player={localPlayer} />
                break
            }
            case "surface": {
                content = <Surface planet={props.planet} />
                break
            }
            case "combat": {
                content = <Combat planet={props.planet} />
                break
            }
            default: {
                console.error(`Cannot find view ${props.screen}`)
                content = <div>Not Found</div>
            }
        }
    }

    return content
}

export default Content
