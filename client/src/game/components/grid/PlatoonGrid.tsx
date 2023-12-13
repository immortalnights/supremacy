import React from "react"
import Recoil from "recoil"
import { SelectedPlanetID } from "../../../data/General"
import { Player } from "../../../data/Player"
import Grid from "./Grid"

// const Platoon = props => {
//   const onClick = () => {
//     if (props.name)
//     {
//       props.onClick(props)
//     }
//   }

//   return (
//     <React.Fragment>
//       <td className="platoon-name" onClick={onClick}>{props.name}</td>
//       <td className="platoon-troops" onClick={onClick}>{props.troops}</td>
//     </React.Fragment>
//   )
// }

// const PlatoonGrid = (props) => {
//   const maxRows = props.rows
//   const maxCols = props.cols

//   const rows = []
//   for (let row = 0; row < maxRows; row++)
//   {
//     const columns = []
//     for (let col = 0; col < maxCols; col++)
//     {
//       const index = (col * 8) + row
//       columns.push(<Platoon key={index} {...props.platoons[index]} onClick={props.onSelect} />)

//       if (maxCols > 1 && col < maxCols - 1)
//       {
//         columns.push(<td key={index + 1} className="spacer"></td>)
//       }
//     }

//     rows.push(
//       <tr key={row}>
//         {columns}
//       </tr>
//     )
//   }

//   return (
//     <table className="platoon grid">
//       <tbody>{rows}</tbody>
//     </table>
//   )
// }

// PlatoonGrid.defaultProps = {
//   rows: 4,
//   cols: 1,
//   onSelect: () => {},
//   items: [],
// }

// export const ShipPlatoons = props => {
//   const platoons = useRecoilValue(selectPlatoons({ ship: props.ship, commissioned: true, player: props.player.id }))
//   return (<PlatoonGrid rows={4} cols={1} platoons={platoons} onSelect={props.onSelect} />)
// }

// export const PlanetPlatoons = props => {
//   const platoons = useRecoilValue(selectPlatoons({ planet: props.planet, commissioned: true, player: props.player.id }))
//   return (<PlatoonGrid rows={8} cols={3} platoons={platoons} onSelect={props.onSelect} />)
// }

interface PlatoonTemp {
    id: number
    name: string
    type: ""
    owner: string
}

interface PlatoonGridProps {
    onSelectItem: (item: PlatoonTemp) => void
    rows: number
    cols: number
}

const PlatoonGrid = ({ onSelectItem, rows, cols }: PlatoonGridProps) => {
    const player = Recoil.useRecoilValue(Player)
    const selectedPlanet = Recoil.useRecoilValue(SelectedPlanetID)
    const platoons: [] = []

    const classNamesForItem = (item: PlatoonTemp) => {
        return item && item.owner === player.id
            ? "planet friendly"
            : "planet enemy"
    }

    return (
        <Grid<PlatoonTemp>
            rows={rows}
            cols={cols}
            items={platoons}
            selected={selectedPlanet}
            onSelectItem={onSelectItem}
            classNamesForItem={classNamesForItem}
        />
    )
}

export default PlatoonGrid
