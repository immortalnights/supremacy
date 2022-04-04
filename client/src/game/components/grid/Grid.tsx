import React from 'react'
import './styles.css'

interface GridItem {
  id: string | number
  name: string
  type: string
}

const Grid = <T extends GridItem,>({ items, selected, onSelectItem, classNamesForItem }: { items: T[], selected: string | number, onSelectItem: (item: T) => void, classNamesForItem?: (item: T) => string }) => {
  const rows: JSX.Element[] = []
  for (let rowIndex = 0; rowIndex < 8; rowIndex++)
  {
    const row: JSX.Element[] = []
    for (let colIndex = 0; colIndex < 4; colIndex++)
    {
      const index = (colIndex * 8) + rowIndex
      let cell
      if (items[index])
      {
        const item = items[index]

        const classes: string[] = []

        if (selected && item.id === selected)
        {
          classes.push("selected")
        }

        if (classNamesForItem)
        {
          classes.push(classNamesForItem(item))
        }

        cell = (<td key={index} title={item.name + " (" + item.type + ")"} className={classes.join(' ')} onClick={e => onSelectItem(item)}>{item.name}</td>)
      }
      else
      {
        cell = (<td key={index}></td>)
      }

      row.push(cell)
    }

    rows.push(<tr key={rowIndex}>{row}</tr>)
  }

  return (
    <table className="grid">
      <tbody>{rows}</tbody>
    </table>
  )
}


// export const PlayerFleetGrid = props => {
// 	const ships = useRecoilValue(selectPlayerShips)
// 	return (<Grid items={ships} {...props} />)
// }

export default Grid
