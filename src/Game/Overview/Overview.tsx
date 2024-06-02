import Button from "../../components/Button"
import Navigation from "../../components/Navigation"
import PlanetDetails from "../../components/PlanetDetails"
import PlanetGrid from "../../components/PlanetGrid"
import ShipLocationGrid from "../../components/ShipLocationGrid"
import renameIcon from "/images/rename.png"
import transferIcon from "/images/transfer.png"
import orbitingIcon from "/images/orbiting.png"
import landedIcon from "/images/landed.png"
import dockedIcon from "/images/docked.png"

export default function Overview() {
    const planet = {
        id: 1,
        name: "Starbase!",
        owner: "local",
        credits: 1234,
        food: 25,
        minerals: 25,
        fuels: 25,
        energy: 25,
        population: 120,
        growth: 5,
        moral: 5,
        tax: 1,
        strength: 10000,
    }

    return (
        <div>
            <div style={{ display: "flex" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Button>
                        <img src={renameIcon} />
                    </Button>
                    <Button>
                        <img src={transferIcon} />
                    </Button>
                </div>
                <PlanetDetails planet={planet} />
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <div>
                    <div style={{ background: "black", height: 32 }}>
                        {/* messages */}
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <Navigation
                            items={["combat", "fleet", "cargo"]}
                            direction="column"
                        />
                        <PlanetGrid planets={[]} />
                    </div>
                </div>
                <div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <Button>
                            <img src={orbitingIcon}></img>
                        </Button>
                        <Button>
                            <img src={landedIcon}></img>
                        </Button>
                        <Button>
                            <img src={dockedIcon}></img>
                        </Button>
                    </div>
                    <ShipLocationGrid ships={[]} />
                </div>
            </div>
        </div>
    )
}
