import { ReactNode } from "react"
import Button from "../Button"

type Entity = { id: string; name: string; owner: string; gridIndex: number }

function Cell({
    color = "#715fc3",
    children,
}: {
    color?: string
    children?: ReactNode
}) {
    return (
        <td
            // key={entity?.id ??}
            style={{
                borderBottom: `2px solid ${color}`,
                borderRight: `2px solid ${color}`,
                width: "6em",
                height: "1em",
            }}
        >
            {children}
        </td>
    )
}

function EntityCell<T extends Entity>({
    entity,
    useTeamColors,
    onClick,
}: {
    entity: T
    useTeamColors: boolean
    onClick: (planet: T) => void
}) {
    const handleClick = () => {
        if (entity) {
            onClick(entity)
        }
    }

    let color
    if (entity && useTeamColors) {
        if (entity.owner === "local") {
            color = "green"
        } else {
            color = "red"
        }
    }

    return (
        <Cell color={color}>
            <Button onClick={handleClick}>{entity.name}</Button>
        </Cell>
    )
}

function EntityRow<T extends Entity>({
    row,
    columns,
    entities,
    useTeamColors,
    onClick,
}: {
    row: number
    columns: number
    entities: T[]
    useTeamColors: boolean
    onClick: (planet: T) => void
}) {
    return (
        <tr>
            {Array(columns)
                .fill(undefined)
                .map((_, col) => {
                    const index = col + row * 4
                    const rowIndex = Math.floor(index / 4)
                    const colIndex = index % 4
                    const entityIndex = rowIndex + colIndex * 8
                    const entity = entities.find(
                        (entity) => entity.gridIndex === entityIndex, //entityIndex,
                    )

                    return entity ? (
                        <EntityCell
                            key={`cell-${row}-${col}`}
                            entity={entity}
                            onClick={onClick}
                            useTeamColors={useTeamColors}
                        />
                    ) : (
                        <Cell key={`cell-${row}-${col}`} />
                    )
                })}
        </tr>
    )
}

export default function EntityGrid<T extends Entity>({
    entities,
    useTeamColors = false,
    onClick,
}: {
    entities: T[]
    useTeamColors?: boolean
    onClick: (planet: T) => void
}) {
    const rows = 8
    const columns = 4

    return (
        <table style={{ userSelect: "none" }}>
            <tbody>
                {Array(rows)
                    .fill(undefined)
                    .map((_, row) => (
                        <EntityRow
                            key={`row-${row}`}
                            row={row}
                            columns={columns}
                            entities={entities}
                            useTeamColors={useTeamColors}
                            onClick={onClick}
                        />
                    ))}
            </tbody>
        </table>
    )
}
