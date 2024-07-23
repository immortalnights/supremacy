import { useAtomValue } from "jotai"
import { Ship } from "../../Game/entities"
import { sessionAtom, shipsAtom } from "../../Game/store"
import EntityGrid from "../EntityGrid"

export default function FleetGrid({
    onClick,
}: {
    onClick: (ship: Ship) => void
}) {
    const { localPlayer } = useAtomValue(sessionAtom)
    const ships = useAtomValue(shipsAtom)
    const filteredShips = ships.filter((planet) => planet.owner === localPlayer)
    return <EntityGrid entities={filteredShips} onClick={onClick} />
}
