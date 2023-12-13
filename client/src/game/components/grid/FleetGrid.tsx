import React from "react"
import Recoil from "recoil"
import { SelectedPlanetID } from "../../../data/General"
import { PlayerShips, IShip } from "../../../data/Ships"
import { Player } from "../../../data/Player"
import Grid from "./Grid"

// TODO allow filtering to the current planet?!

const FleetGrid = ({
    selectedItem,
    onSelectItem,
}: {
    selectedItem: IShip | undefined
    onSelectItem: (item: IShip) => void
}) => {
    const _player = Recoil.useRecoilValue(Player)
    const _selectedPlanet = Recoil.useRecoilValue(SelectedPlanetID)
    const ships = Recoil.useRecoilValue(PlayerShips)

    const classNamesForItem = (_item: IShip) => {
        return ""
    }

    return (
        <Grid<IShip>
            items={ships}
            selected={selectedItem !== undefined ? selectedItem.id : undefined}
            onSelectItem={onSelectItem}
            classNamesForItem={classNamesForItem}
        />
    )
}

export default FleetGrid
