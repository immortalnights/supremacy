import { Planet, PlanetType } from "Supremacy/entities"
import starbase from "/images/planet_starbase.gif"
import metropolis from "/images/planet_metropolis.gif"
import dessert from "/images/planet_dessert.gif"
import volcanic from "/images/planet_volcanic.gif"
import lifeless from "/images/planet_lifeless.gif"
import terraforming from "/images/planet_terraforming.gif"
import { ReactNode } from "react"
import { useAtomValue } from "jotai"
import { sessionAtom } from "Game/store"
import { useSession } from "Game/hooks/session"

const planetImage: { [key in PlanetType]: string } = {
    lifeless: lifeless,
    metropolis: metropolis,
    volcanic: volcanic,
    dessert: dessert,
    tropical: lifeless, // FIXME
}

export default function PlanetInfoGraph({ planet }: { planet: Planet }) {
    const { localPlayer } = useSession()

    let name
    let img: ReactNode = null
    if (planet.type !== "lifeless") {
        name = planet.name
        if (planet.owner !== localPlayer) {
            img = (
                <div
                    style={{
                        margin: "auto",
                    }}
                >
                    Classified!
                </div>
            )
        } else if (planet.capital) {
            img = <img src={starbase} />
        } else {
            img = <img src={planetImage[planet.type]} />
        }
        // } else if (planet.terraforming) {
        // img = <img src={terraforming}  />
    } else {
        name = "Lifeless!"
        img = <img src={lifeless} />
    }

    return (
        <div>
            <div
                style={{
                    width: 125,
                    height: 100,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "black",
                    margin: "auto",
                }}
            >
                {img}
            </div>
            <div>{name}</div>
        </div>
    )
}
