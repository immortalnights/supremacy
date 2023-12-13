import React from "react"
import Recoil from "recoil"
import { SelectedPlanetID } from "../../../data/General"
import { Planets, IPlanetBasic } from "../../../data/Planets"
import { Player } from "../../../data/Player"
import { PlanetType } from "@server/simulation/types"
import Grid from "./Grid"

const PlanetGrid = ({
    onSelectItem,
}: {
    onSelectItem: (item: IPlanetBasic) => void
}) => {
    const player = Recoil.useRecoilValue(Player)
    const selectedPlanet = Recoil.useRecoilValue(SelectedPlanetID)
    const planets = Recoil.useRecoilValue(Planets).map((p) =>
        p.type !== PlanetType.Lifeless ? p : undefined
    ) as IPlanetBasic[]

    const classNamesForItem = (item: IPlanetBasic) => {
        return item && item.owner === player.id
            ? "planet friendly"
            : "planet enemy"
    }

    return (
        <Grid<IPlanetBasic>
            items={planets}
            selected={selectedPlanet}
            onSelectItem={onSelectItem}
            classNamesForItem={classNamesForItem}
        />
    )
}

export default PlanetGrid
