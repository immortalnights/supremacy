import { Planet } from "../../entities"
import starbaseGif from "/images/starbase.gif"

export default function PlanetInfoGraph({ planet }: { planet: Planet }) {
    return (
        <div>
            <img src={starbaseGif} />
            <div>{planet.name}</div>
        </div>
    )
}
