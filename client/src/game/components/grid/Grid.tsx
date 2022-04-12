import React from 'react'
import './styles.css'

interface GridItem {
  id: string | number
  name: string
  type: string
}

interface GridProps<T> {
  items: T[],
  selected: string | number,
  onSelectItem: (item: T) => void,
  classNamesForItem?: (item: T) => string
  rows?: number
  cols?: number
}

const Grid = <T extends GridItem,>({
  items,
  selected,
  onSelectItem,
  classNamesForItem,
  rows = 8,
  cols = 4
}: GridProps<T>) => {
  const rowElements: React.ReactNode[] = []
  for (let rowIndex = 0; rowIndex < rows; rowIndex++)
  {
    const row: React.ReactNode[] = []
    for (let colIndex = 0; colIndex < cols; colIndex++)
    {
      const index = (colIndex * rows) + rowIndex
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

    rowElements.push(<tr key={rowIndex}>{row}</tr>)
  }

  return (
    <table className="grid">
      <tbody>{rowElements}</tbody>
    </table>
  )
}


// export const PlayerFleetGrid = props => {
// 	const ships = useRecoilValue(selectPlayerShips)
// 	return (<Grid items={ships} {...props} />)
// }

export default Grid
