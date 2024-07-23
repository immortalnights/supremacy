import Button from "../../components/Button"
import Navigation from "../../components/Navigation"
import PlanetDetails from "../../components/PlanetDetails"
import EntityGrid from "../../components/EntityGrid"
import ShipLocationGrid from "../../components/ShipLocationGrid"
import renameIcon from "/images/rename_planet.png"
import transferIcon from "/images/transfer.png"
import orbitingIcon from "/images/orbiting.png"
import landedIcon from "/images/landed.png"
import dockedIcon from "/images/docked.png"
import { useAtomValue, useSetAtom } from "jotai"
import { planetsAtom, selectedPlanetAtom, sessionAtom } from "../store"
import { Planet } from "../entities"
import {
    FormEvent,
    KeyboardEvent,
    FocusEvent,
    useState,
    ChangeEvent,
} from "react"
import { useRenamePlanet } from "../../commands"
import PlanetGrid from "../../components/PlanetGrid"

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
        if (selectedPlanet?.owner === localPlayer) {
            onRename(selectedPlanet)
        }
    }
    const handleTransferToCapital = () => {
        if (!selectedPlanet?.capital) {
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
export default function Overview() {
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
                        <PlanetGrid />
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
