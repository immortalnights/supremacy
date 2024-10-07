import Button from "../../components/Button"
import Navigation from "../components/Navigation"
import PlanetDetails from "./components/PlanetDetails"
import ShipLocationGrid from "../components/ShipLocationGrid"
import renameIcon from "/images/rename_planet.png"
import transferIcon from "/images/transfer.png"
import orbitingIcon from "/images/orbiting.png"
import landedIcon from "/images/landed.png"
import dockedIcon from "/images/docked.png"
import { useAtomValue, useSetAtom } from "jotai"
import { selectedPlanetAtom, sessionAtom, shipsAtom } from "../store"
import { Planet, ShipPosition } from "../entities"
import {
    FormEvent,
    KeyboardEvent,
    FocusEvent,
    useState,
    ChangeEvent,
    useMemo,
} from "react"
import { useRenamePlanet } from "./actions"
import PlanetGrid from "../components/PlanetGrid"

function RenamePlanet({
    onRename,
    onCancel,
}: {
    onRename: ({ name }: { name: string }) => void
    onCancel: () => void
}) {
    const selectedPlanet = useAtomValue(selectedPlanetAtom)
    const [name, setName] = useState(selectedPlanet?.name ?? "")

    const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault()
        onRename({ name })
    }

    const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setName(ev.currentTarget.value)
    }

    const handleKeyDown = (ev: KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === "Escape") {
            onCancel()
        }
    }

    const handleFocus = (ev: FocusEvent<HTMLInputElement>) => {
        ev.currentTarget.selectionStart = 0
        ev.currentTarget.selectionEnd = ev.currentTarget.value.length
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={name}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onFocus={handleFocus}
                />
                <button type="submit">Rename</button>
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </form>
        </div>
    )
}

function SelectedPlanet({ onRename }: { onRename: (planet: Planet) => void }) {
    const { localPlayer } = useAtomValue(sessionAtom)
    const selectedPlanet = useAtomValue(selectedPlanetAtom)
    // const transfer = useTransferCredits()

    const handleStartRenamePlanet = () => {
        if (
            selectedPlanet?.type !== "lifeless" &&
            selectedPlanet?.owner === localPlayer
        ) {
            onRename(selectedPlanet)
        }
    }
    const handleTransferToCapital = () => {
        if (selectedPlanet?.type !== "lifeless" && !selectedPlanet?.capital) {
            // transfer(selectedPlanet)
        }
    }

    return (
        <div style={{ display: "flex" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <Button onClick={handleStartRenamePlanet}>
                    <img src={renameIcon} />
                </Button>
                <Button onClick={handleTransferToCapital}>
                    <img src={transferIcon} />
                </Button>
            </div>
            <PlanetDetails />
        </div>
    )
}

function PlanetShipOverview() {
    const [viewPosition, setViewPosition] = useState<ShipPosition>("orbit")
    const { localPlayer } = useAtomValue(sessionAtom)
    const selectedPlanet = useAtomValue(selectedPlanetAtom)
    const ships = useAtomValue(shipsAtom)

    const filteredShips =
        selectedPlanet?.type !== "lifeless" &&
        selectedPlanet?.owner === localPlayer
            ? ships.filter(
                  (ship) =>
                      ship.location.position === viewPosition &&
                      ship.location.planet === selectedPlanet?.id,
              )
            : []

    const message = useMemo(() => {
        let msg
        switch (viewPosition) {
            case "orbit": {
                msg = `Ships in orbit above ${selectedPlanet?.name}`
                break
            }
            case "surface": {
                msg = `Ships on surface of above ${selectedPlanet?.name}`
                break
            }
            case "docked": {
                msg = `In docking bays on ${selectedPlanet?.name}`
                break
            }
            default: {
                break
            }
        }

        return msg
    }, [viewPosition, selectedPlanet])

    return (
        <>
            <div style={{ display: "flex", flexDirection: "row", gap: 1 }}>
                <Button onClick={() => setViewPosition("orbit")}>
                    <img src={orbitingIcon}></img>
                </Button>
                <Button onClick={() => setViewPosition("surface")}>
                    <img src={landedIcon}></img>
                </Button>
                <Button onClick={() => setViewPosition("docked")}>
                    <img src={dockedIcon}></img>
                </Button>
            </div>
            <div>{message}</div>
            <ShipLocationGrid ships={filteredShips} onClick={() => {}} />
        </>
    )
}

export default function Overview() {
    const { localPlayer } = useAtomValue(sessionAtom)
    const setSelectedPlanet = useSetAtom(selectedPlanetAtom)
    const [renamePlanet, setRenamingPlanet] = useState<Planet | undefined>(
        undefined,
    )
    const rename = useRenamePlanet()

    const handleRenamePlanet = ({ name }: { name: string }) => {
        if (renamePlanet) {
            rename(renamePlanet, name)
        }
        setRenamingPlanet(undefined)
    }

    const handleEndRenamePlanet = () => {
        setRenamingPlanet(undefined)
    }

    const handleSelectPlanet = (planet: Planet) => {
        if (planet.type !== "lifeless" && planet.owner === localPlayer) {
            setSelectedPlanet(planet)
        }
    }

    return (
        <div>
            <SelectedPlanet onRename={(planet) => setRenamingPlanet(planet)} />
            <div style={{ display: "flex", flexDirection: "row" }}>
                <div>
                    {renamePlanet ? (
                        <RenamePlanet
                            onRename={handleRenamePlanet}
                            onCancel={handleEndRenamePlanet}
                        />
                    ) : (
                        <div style={{ background: "black", height: 32 }}>
                            {/* messages */}
                        </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <Navigation
                            items={["combat", "fleet", "cargo"]}
                            direction="column"
                        />
                        <PlanetGrid onClick={handleSelectPlanet} />
                    </div>
                </div>
                <div>
                    <PlanetShipOverview />
                </div>
            </div>
        </div>
    )
}
