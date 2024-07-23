import { ReactNode } from "react"
import Button from "../Button"

type Entity = {
    id: string
    name: string
    owner: string | undefined
    gridIndex?: number
}

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
    localPlayer,
    onClick,
}: {
    entity: T
    localPlayer?: string
    onClick: (planet: T) => void
}) {
    const handleClick = () => {
        if (entity) {
            onClick(entity)
        }
    }

    let color
    if (entity && localPlayer) {
        if (entity.owner === localPlayer) {
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

const gridEntity = (entities: Entity[], index: number) => {
    let entity

    if (entities.length > 0 && entities[0].gridIndex) {
        const rowIndex = Math.floor(index / 4)
        const colIndex = index % 4
        const entityIndex = rowIndex + colIndex * 8
        entity = entities.find((item) => item.gridIndex === entityIndex)
    } else if (entities.length > index) {
        entity = entities[index]
    }

    return entity
}

function EntityRow<T extends Entity>({
    row,
    columns,
    entities,
    localPlayer,
    onClick,
}: {
    row: number
    columns: number
    entities: T[]
    localPlayer?: string
    onClick: (planet: T) => void
}) {
    return (
        <tr>
            {Array(columns)
                .fill(undefined)
                .map((_, col) => {
                    const index = col + row * 4
                    const entity = gridEntity(entities, index)

                    return entity ? (
                        <EntityCell
                            key={`cell-${row}-${col}`}
                            entity={entity}
                            localPlayer={localPlayer}
                            onClick={onClick}
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
    localPlayer,
    onClick,
}: {
    entities: T[]
    localPlayer?: string
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
                            localPlayer={localPlayer}
                            onClick={onClick}
                        />
                    ))}
            </tbody>
        </table>
    )
}
