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
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { planetsAtom, selectedPlanetAtom } from "../store"
import { Planet } from "../entities"
import {
    FormEvent,
    KeyboardEvent,
    FocusEvent,
    useState,
    ChangeEvent,
} from "react"

function RenamePlanet({
    onComplete,
    onCancel,
}: {
    onComplete: () => void
    onCancel: () => void
}) {
    const selectedPlanet = useAtomValue(selectedPlanetAtom)
    const setPlanets = useSetAtom(planetsAtom)
    const [name, setName] = useState(selectedPlanet?.name)

    const handleRenamePlanet = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault()

        setPlanets((state) => {
            const cpy = [...state]

            const index = cpy.findIndex((p) => p.id === selectedPlanet?.id)
            if (index !== -1) {
                cpy[index] = { ...cpy[index], name }
            }

            return cpy
        })

        onComplete()
    }

    const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setName(ev.currentTarget.value)
    }

    const handleKeyDown = (ev: KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === "esc") {
            onCancel()
        }
    }

    const handleFocus = (ev: FocusEvent<HTMLInputElement>) => {
        ev.currentTarget.selectionStart = 0
        ev.currentTarget.selectionEnd = ev.currentTarget.value.length
    }

    return (
        <div>
            <form onSubmit={handleRenamePlanet}>
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

export default function Overview() {
    const planets = useAtomValue(planetsAtom)
    const [isRenamingPlanet, setIsRenamingPlanet] = useState(false)
    const [selectedPlanet, setSelectedPlanet] = useAtom(selectedPlanetAtom)
    const filteredPlanets = planets.filter((planet) => !!planet.name)

    const handleStartRenamePlanet = () => {
        if (selectedPlanet?.owner === "local") {
            setIsRenamingPlanet(true)
        }
    }

    const handleEndRenamePlanet = () => {
        setIsRenamingPlanet(false)
    }

    const handleTransferToCapital = () => {
        if (!selectedPlanet?.capital) {
            // TODO
        }
    }

    const handleSelectPlanet = (planet: Planet) => {
        if (planet.owner === "local") {
            setSelectedPlanet(planet)
        }
    }

    return (
        <div>
            <div style={{ display: "flex" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Button onClick={handleStartRenamePlanet}>
                        <img src={renameIcon} />
                    </Button>
                    <Button onClick={handleTransferToCapital}>
                        <img src={transferIcon} />
                    </Button>
                </div>
                {selectedPlanet && <PlanetDetails planet={selectedPlanet} />}
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <div>
                    {isRenamingPlanet ? (
                        <RenamePlanet
                            onComplete={handleEndRenamePlanet}
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
                        <EntityGrid
                            entities={filteredPlanets}
                            useTeamColors
                            onClick={handleSelectPlanet}
                        />
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
