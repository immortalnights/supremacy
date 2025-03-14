import { useAtomValue } from "jotai"
import { Ship } from "Supremacy/entities"
import { sessionAtom, shipsAtom } from "../../store"
import EntityGrid from "../EntityGrid"
import { useSession } from "Game/hooks/session"

export default function FleetGrid({ onClick }: { onClick: (ship: Ship) => void }) {
    const { localPlayer } = useSession()
    const ships = useAtomValue(shipsAtom)
    const filteredShips = ships.filter((planet) => planet.owner === localPlayer)
    return <EntityGrid entities={filteredShips} onClick={onClick} />
}
