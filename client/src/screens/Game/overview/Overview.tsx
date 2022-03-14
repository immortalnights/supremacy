import React from "react"
import { Button } from "@mui/material"


const TaxControls = (props: any) => {
	const setPlanetTax = (planet: any, value: number) => {} // useSetTax()

	const onHoldIncTax = (modifiers: any) => {
		const mod = modifiers.ctrl ? 5 : 1
		setPlanetTax({ id: props.planet.id }, props.planet.tax + mod)
	}

	const onHoldDecTax = (modifiers: any) => {
		const mod = modifiers.ctrl ? -5 : -1
		setPlanetTax({ id: props.planet.id }, props.planet.tax + mod)
	}

	return (
		<div className="flex flex-rows" style={{ margin: '0 5px 0 0' }}>
      <Button>Inc</Button>
      <Button>Dec</Button>
			{/* <Button onHold={onHoldIncTax} frequency="scale">Inc</Button> */}
			{/* <Button onHold={onHoldDecTax} frequency="scale">Dec</Button> */}
		</div>
	)
}

const PlanetOverview = (props: any) => {
	// const platoons = useRecoilValue(store.platoons)
	const planet: any = {} // useRecoilValue(store.planets(props.id))

	if (!planet)
	{
		return (<div>Planet {props.id} does not exist</div>)
	}

	return (
		<div className="flex-columns" style={{alignItems: 'baseline'}}>
			<dl>
				<dt>Planet</dt>
				<dd>{planet.name || planet.id}</dd>
				<dt>Date</dt>
				<dd>{/*<StarDate />*/}</dd>
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
					<TaxControls planet={planet}  />
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

const InlineName = ({ message, value, onCancel, onComplete }: any) => {
  return null
}

const PlanetGrid = (props: any) => {
  return null
}

const Message = () => {
  return null
}

const Overview = () => {
  const onStartRename = () => {}
  const onTransferCredits = () => {}
  const onCancelRename = () => {}
  const onSelectItem = () => {}
  const onSetName = () => {}
  const selected = null
  const rename = false
  const planet: any = {}

  return (
    <div>
      <div className="flex-columns">
        <div className="flex flex-rows" style={{margin: 'auto 10px', flex: '0 1 0'}}>
          <Button onClick={onStartRename}>Rename</Button>
          <Button onClick={onTransferCredits} style={{whiteSpace: 'nowrap'}}>Transfer Credits</Button>
        </div>
        <PlanetOverview id={selected} />
      </div>
      <div className="flex-columns">
        <div>
          {rename ? (<InlineName message="Rename planet" value={planet.name} onCancel={onCancelRename} onComplete={onSetName} />) : <Message />}
          <PlanetGrid selected={planet} player={{id: planet.owner}} onSelectItem={onSelectItem} />
        </div>
        <OverviewSlots planet={planet} />
      </div>
    </div>
  )
}

export default Overview