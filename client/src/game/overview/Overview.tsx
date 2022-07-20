import React from "react"
import Recoil from "recoil"
import { Box, Button, Stack, TextField, Tabs, Tab, Typography } from "@mui/material"
import { useNavigate } from "react-router"
import { IOContext } from "../../data/IOContext"
import { SelectedPlanetID } from "../../data/General"
import { SelectedPlanet, IPlanet, IPlanetBasic } from "../../data/Planets"
import StarDate from "../components/StarDate"
import "./styles.css"
import PlanetGrid from "../components/grid/PlanetGrid"
import PlanetAuth from "../components/PlanetAuth"
import IncDecButton from "../components/IncreaseDecreaseButton"
import { PlayerShipsAtPlanetPosition } from "../../data/Ships"
import { PlanetStrength } from "../../data/Platoons"
import { Player } from "../../data/Player"
import { RenameDialog } from "../components/NameDialog"


const TaxControls = ({ planet }: { planet: IPlanet }) => {
  const { action } = React.useContext(IOContext)

  const handleChangeTax = (value: number) => {
    action("planet-modify-tax", {
      planet: planet.id,
      value,
    }).catch(() => {})
  }

  return (
    <div className="flex flex-rows" style={{ margin: '0 5px 0 0' }}>
      <IncDecButton label="Inc" mode="increase" onChange={(event, value) => handleChangeTax(value)} multiplier={5} />
      <IncDecButton label="Dec" mode="decrease" onChange={(event, value) => handleChangeTax(value)} multiplier={5} />
    </div>
  )
}


const ChangeValue = ({ values }: { values: number[] }) => {
  const average = Math.abs(values.reduce((prev, val, index) => prev + val, 0)) / values.length
  const trend = Math.abs(values[values.length - 1]) - average
  let trendString = ""
  if (trend === 0)
  {
    trendString = "="
  }
  else if (trend < 0)
  {
    trendString = "-"
  }
  else if (trend > 0)
  {
    trendString = "+"
  }

  return (<strong>{trendString}</strong>)
}

const PlanetDetails = ({ planet }: { planet: IPlanet }) => {
  const militaryStrength = Recoil.useRecoilValue(PlanetStrength({ planet: planet.id }))

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
        <dd><ChangeValue values={planet.history.food} /> {planet.resources.food.toFixed(0)} T.</dd>
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
        <dd><ChangeValue values={planet.history.growth} /> {Math.floor(planet.growth)} %</dd>
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
        <dd>{militaryStrength}</dd>
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
      <table style={{ width: "100%" }}>
        <tbody>{rows}</tbody>
      </table>
    </div>
  )
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const ShipGrid = () => {
  console.log("rendering grid")
  return null
}

const OverviewSlots = ({ planet }: any) => {
  const [ tabIndex, setTabIndex ] = React.useState(2)
  const positions = ["orbit", "surface", "docking-bay"]
  const ships = Recoil.useRecoilValue(PlayerShipsAtPlanetPosition({ planet: planet.id, position: positions[tabIndex] }))
  const onSelectItem = () => {}

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue)
  }

  return (
    <div style={{ margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="In Orbit" />
          <Tab label="On the Surface" />
          <Tab label="Docked" />
        </Tabs>
      </Box>
      <IconGrid items={ships} onSelectItem={onSelectItem} />
    </div>
  )
}

const Overview = ({ planet }: { planet: IPlanet }) => {
  const [ rename, setRename ] = React.useState(false)
  const player = Recoil.useRecoilValue(Player)
  const [ selected, setSelected ] = Recoil.useRecoilState(SelectedPlanetID)
  const { action } = React.useContext(IOContext)

  const onStartRename = () => {
    setRename(!rename)
  }
  const handleCancelRename = () => {
    setRename(false)
  }
  const onTransferCredits = () => {
    action("transfer-credits", {
      planet: planet?.id
    })
  }
  const onSelectPlanet = (planet: IPlanetBasic) => {
    if (planet.owner === player.id)
    {
      setSelected(planet.id)
    }
  }

  const handleConfirmRename = (newName: string) => {
    action("rename-planet", {
      planet: planet!.id,
      name: newName,
    })
    setRename(false)
  }

  return (
    <>
      {rename && planet && <RenameDialog open name={planet.name} onConfirm={handleConfirmRename} onCancel={handleCancelRename} />}
      <Stack direction="row">
        <div>
          <Button onClick={onStartRename}>Rename</Button>
          <Button onClick={onTransferCredits} disabled={planet?.capital} style={{whiteSpace: 'nowrap'}}>Transfer Credits</Button>
        </div>
        <PlanetDetails planet={planet} />
      </Stack>
      <Stack direction="row">
        <div>
          <PlanetGrid onSelectItem={onSelectPlanet} />
        </div>
        {/* <div style={{ flexGrow: 1 }}></div> */}
        <OverviewSlots planet={planet} />
      </Stack>
    </>
  )
}

const Authed = () => {
  return (<PlanetAuth view={(planet: IPlanet) => (<Overview planet={planet} />)} />)
}

export default Authed