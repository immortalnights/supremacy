import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { Button } from 'seventh-component-library'
import { selectHumanPlayer } from '../../state/game'
import { selectCapitalPlanet } from '../../state/planets'
import { blueprints, selectCountOwnedShip, selectNextShipName, useBuyShip } from '../../state/shipyard'

const Details = props => {
	const player = useRecoilValue(selectHumanPlayer)
	const capital = useRecoilValue(selectCapitalPlanet(player))
	const owned = useRecoilValue(selectCountOwnedShip(props))

	return (
		<div className="flex-columns" style={{justifyContent: 'space-around'}}>
			<div>
				<label>Starbase</label>
				<div>{capital.resources.credits} :Credits</div>
			</div>
			<div>
				<label>Cost</label>
				<div>{props.cost[0].credits} :Credits</div>
			</div>
			<div>
				<label>Capacity</label>
				<dl>
					<dd>{props.requiredCrew} T.</dd>
					<dt>:Crew</dt>
					<dd>{props.capacity.cargo} T.</dd>
					<dt>:Payload</dt>
					<dd>{props.maximumFuel} T.</dd>
					<dt>:Fuel</dt>
				</dl>
			</div>
			<div>
				<label>Data</label>
				<div>{owned} :Owned</div>
			</div>
		</div>
	)
}

const Shipyard = props => {
	const bps = useRecoilValue(blueprints)
	const indexes = Object.keys(bps)
	const [ index, setIndex ] = useState(indexes[0])
	const ship = bps[index]
	const [ buying, setBuying ] = useState(false)
	const player = useRecoilValue(selectHumanPlayer)
	const buyShip = useBuyShip(player)
	const nextShipName = useRecoilValue(selectNextShipName(ship))

	const onClickNext = () => {
		if (!buying)
		{
			const nextIndex = indexes.indexOf(index) + 1

			if (nextIndex >= indexes.length)
			{
				setIndex(indexes[0])
			}
			else
			{
				setIndex(indexes[nextIndex])
			}
		}
	}

	const onClickPrevious = () => {
		if (!buying)
		{
			const previousIndex = indexes.indexOf(index) - 1
			if (previousIndex < 0)
			{
				setIndex(indexes[indexes.length - 1])
			}
			else
			{
				setIndex(indexes[previousIndex])
			}
		}
	}

	const onClickBuy = () => {
		console.log(`buy ${index}`)
		setBuying(true)
	}

	const onKeyDown = e => {
		switch (e.key)
		{
			case 'Enter':
			{
				if (e.target.value)
				{
					buyShip(index, e.target.value)
					setBuying(false)
				}
				break
			}
			case 'Escape':
			{
				setBuying(false)
				break
			}
			default:
			{
				break
			}
		}
	}

	// console.log(bps, index, bps[index])
	return (
		<div>
			<div>Shipyard</div>
			<div style={{ margin: '0 auto', width: '80%' }}>
				<img src="" alt={index} />
				<div className="flex-columns" style={{ justifyContent: 'space-around' }}>
					<Button onClick={onClickPrevious}>&lt;=</Button>
					<Button onClick={onClickBuy}>Buy</Button>
					<div style={{ flexBasis: '75%', lineHeight: '1.5em' }}>
						<div style={{ display: 'inline-block', margin: '0 10px' }}>
							<div>{ship.description}</div>
							<div>Type {ship.type}</div>
						</div>
						{buying ? <input name="name" onKeyDown={onKeyDown} defaultValue={nextShipName} autoFocus /> : ""}
					</div>
					<Button onClick={onClickNext}>=&gt;</Button>
				</div>
				<Details { ...ship } />
			</div>
		</div>
	)
}

export default Shipyard