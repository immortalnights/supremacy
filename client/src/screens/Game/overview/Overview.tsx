import React from "react"
import Recoil from "recoil"
import { IOContext } from "../../../data/IOContext"
import { Box, Button, TextField } from "@mui/material"
import { IPlayer, Player } from "../../../data/Player"
import { SelectedPlanet, IPlanet } from "../../../data/Planets"
import { StarDate } from "../../../components/StarDate"
import { useNavigate } from "react-router"

const HoldButton = ({ onHold, children }: { onHold: (modifier: boolean) => void, children: JSX.Element | string }) => {
  const intervalRef = React.useRef<number | undefined>(undefined)
  const didHoldRef = React.useRef<boolean>(false)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (didHoldRef.current === false)
    {
      onHold(event.ctrlKey)
      didHoldRef.current = false
    }
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    didHoldRef.current = false
    if (!intervalRef.current)
    {
      intervalRef.current = window.setInterval(() => {
        didHoldRef.current = true
        onHold(event.ctrlKey)
      }, 100)
    }
  }

  const handleMouseUp = (event: React.MouseEvent<HTMLButtonElement>) => {
    window.clearInterval(intervalRef.current)
    intervalRef.current = undefined
  }

  React.useEffect(() => {
    return () => window.clearInterval(intervalRef.current)
  }, [])

  return <Button onClick={handleClick} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>{children}</Button>
}

const TaxControls = ({ planet }: { planet: IPlanet }) => {
  const { action } = React.useContext(IOContext)

  const handleIncTax = (modifier: boolean) => {
    action("planet-modify-tax", {
      planet: planet.id,
      value: modifier ? 5 : 1,
    }).catch(() => {})
  }
  const handleDecTax = (modifier: boolean) => {
    action("planet-modify-tax", {
      planet: planet.id,
      value: -(modifier ? 5 : 1),
    }).catch(() => {})
  }

  return (
    <div className="flex flex-rows" style={{ margin: '0 5px 0 0' }}>
      <HoldButton onHold={handleIncTax}>Inc</HoldButton>
      <HoldButton onHold={handleDecTax}>Dec</HoldButton>
    </div>
  )
}

const PlanetDetails = ({ planet }: { planet: IPlanet }) => {
  return (
    <div className="flex-columns" style={{alignItems: 'baseline'}}>
      <dl>
        <dt>Planet</dt>
        <dd>{planet.name || planet.id}</dd>
        <dt>Date</dt>
        <dd><StarDate /></dd>
        <dt>Status</dt>
        <dd>{planet.status}</dd>
        <dt>Credits</dt>
        <dd>{planet.resources.credits.toFixed(0)}</dd>

        <dt>Food</dt>
        <dd>{planet.resources.foodChange} {planet.resources.food.toFixed(0)} T.</dd>
        <dt>Minerals</dt>
        <dd>{planet.resources.minerals.toFixed(0)} T.</dd>
        <dt>Fuels</dt>
        <dd>{planet.resources.fuels.toFixed(0)} T.</dd>
        <dt>Energy</dt>
        <dd>{planet.resources.energy.toFixed(0)} T.</dd>
      </dl>
      <dl>
        <dt>Population</dt>
        <dd>{planet.population.toFixed(0)}</dd>
        <dt>Growth</dt>
        <dd>{planet.growthChange} {Math.floor(planet.growth)} %</dd>
        <dt>Morale</dt>
        <dd>{planet.morale.toFixed(0)} %</dd>

        <dt className="flex-columns">
          <TaxControls planet={planet} />
          <span style={{margin: 'auto 5px auto 0', whiteSpace: 'nowrap' }}>Tax Rate</span>
        </dt>
        <dd style={{display: 'flex'}}>
          <span style={{margin: 'auto 0'}}>{planet.tax} %</span>
        </dd>

        <dt style={{whiteSpace: 'nowrap'}}>Military Strength</dt>
        <dd>{0}</dd>
      </dl>
    </div>
  )
}

const IconGrid = (props: any) => {
  const rows = []
  for (let rowIndex = 0; rowIndex < 2; rowIndex++)
  {
    const row = []
    for (let colIndex = 0; colIndex < 3; colIndex++)
    {
      const index = colIndex + (rowIndex * 3)
      let cell
      if (props.items[index])
      {
        const item = props.items[index]
        cell = (<td key={index} title={item.name + " (" + item.type + ")"} onClick={e => props.onSelectItem(item)}>{item.name}</td>)
      }
      else
      {
        cell = (<td key={index} className="empty">Empty</td>)
      }

      row.push(cell)
    }

    rows.push(<tr key={rowIndex}>{row}</tr>)
  }

  return (
    <div className="icon-grid">
      <table>
        <tbody>{rows}</tbody>
      </table>
    </div>
  )
}

const OverviewSlots = ({ planet }: any) => {
  const setSlotType = (slot: string) => {}
  const onSelectItem = () => {}
  const ships: any[] = []
  const message = ""

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div>
        <Button onClick={() => setSlotType('orbit')}>Ships in Orbit</Button>
        <Button onClick={() => setSlotType('surface')}>Ships on the Surface</Button>
        <Button onClick={() => setSlotType('docked')}>Ships Docked</Button>
      </div>
      <div style={{textAlign: 'center'}}>{message}</div>
      <IconGrid items={ships} onSelectItem={onSelectItem} />
    </div>
  )
}

const InlineName = ({ label, value, onCancel, onComplete }: any) => {
  const [ name, setName ] = React.useState(value)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onComplete(name)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape")
    {
      onCancel()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        name="planetname"
        id="planetname"
        label={label}
        variant="standard"
        defaultValue={name}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={(event: React.FocusEvent<HTMLInputElement>) => event.target.select()}
        autoFocus
        autoComplete="off" />
    </form>
  )
}

const PlanetGrid = (props: any) => {
  return null
}

const Message = () => {
  return null
}

const PlanetOverview = ({ planet }: { planet: IPlanet }) => {
  const [ rename, setRename ] = React.useState(false)
  const { action } = React.useContext(IOContext)

  const onStartRename = () => {
    setRename(!rename)
  }
  const handleCancelRename = () => {
    setRename(false)
  }
  const handleSetName = (name: string) => {
    action("rename-planet", {
      planet: planet?.id,
      name,
    })
    setRename(false)
  }
  const onTransferCredits = () => {
    action("transfer-credits", {
      planet: planet?.id
    })
  }
  const onSelectItem = () => {}
  const selected = null

  return (
    <div>
      <div className="flex-columns">
        <div className="flex flex-rows" style={{margin: 'auto 10px', flex: '0 1 0'}}>
          <Button onClick={onStartRename}>Rename</Button>
          <Button onClick={onTransferCredits} disabled={planet?.capital} style={{whiteSpace: 'nowrap'}}>Transfer Credits</Button>
        </div>
        <PlanetDetails planet={planet} />
      </div>
      <div className="flex-columns">
        <div>
          {rename ? (<InlineName label="Rename planet" value={planet?.name} onCancel={handleCancelRename} onComplete={handleSetName} />) : <Message />}
          <PlanetGrid selected={planet} player={{id: planet?.owner}} onSelectItem={onSelectItem} />
        </div>
        <OverviewSlots planet={planet} />
      </div>
    </div>
  )
}

const AccessDenied = () => {
  const navigate = useNavigate()

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate(-1)
    }, 1000)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  return (<Box sx={{ color: "error.main", textAlign: "center", border: "1px solid red", borderRadius: 2, padding: 1, width: 180, margin: "0 auto" }}>Access Denied</Box>)
}

const Overview = () => {
  const player = Recoil.useRecoilValue(Player) as IPlayer
  const planet = Recoil.useRecoilValue(SelectedPlanet) as IPlanet
  const isOwner = (planet.owner === player.id)

  return isOwner ? (<PlanetOverview planet={planet} />) : (<AccessDenied />)
}

export default Overview