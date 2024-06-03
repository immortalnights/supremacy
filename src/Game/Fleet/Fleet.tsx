import DockingBay from "../../components/DockingBay"
import launchIcon from "/images/launch.png"
import travelIcon from "/images/travel.png"
import dockIcon from "/images/dock.png"
import decommissionIcon from "/images/decommission.png"
import renameIcon from "/images/rename_ship.png"
import Button from "../../components/Button"
import ShipDetails from "../../components/ShipDetails"
import ShipHeading from "../../components/ShipHeading"
import Navigation from "../../components/Navigation"

export default function Fleet() {
    const planet = {
        id: "1",
        name: "Homebase!",
    }
    const ships = []

    return (
        <div>
            <div style={{ display: "flex" }}>
                <DockingBay planet={planet} ships={ships} />
                <div>
                    <div>
                        <Button>
                            <img src={launchIcon} />
                        </Button>
                        <Button>
                            <img src={travelIcon} />
                        </Button>
                        <Button>
                            <img src={dockIcon} />
                        </Button>
                    </div>
                    <div>
                        <ShipDetails />
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Button>
                        <img src={decommissionIcon} />
                    </Button>
                    <Button>
                        <img src={renameIcon} />
                    </Button>
                </div>
            </div>
            <div>
                <div style={{ background: "black", height: 64 }}></div>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <Navigation
                    items={["combat", "shipyard", "cargo"]}
                    direction="column"
                />
                {/* <ShipGrid /> */}
                <ShipHeading />
                <Navigation
                    items={["surface", "overview", "training"]}
                    direction="column"
                />
            </div>
        </div>
    )
}
