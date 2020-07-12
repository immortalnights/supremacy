import React, { useState } from 'react'
import { useRecoilState, useRecoilValue, useRecoilCallback } from 'recoil'
import { Button } from 'seventh-component-library'
import store from '../../state/atoms'
import { selectHumanPlayer } from '../../state/game'
import { blueprints, selectNextShipName, useBuyShip } from '../../state/shipyard'

const Shipyard = props => {
	const bps = useRecoilValue(blueprints)
	const indexes = Object.keys(bps)
	const [ index, setIndex ] = useState(indexes[0])
	const ship = bps[index]
	const [ buying, setBuying ] = useState(false)
	const buyShip = useBuyShip(useRecoilValue(selectHumanPlayer))
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
		}
	}

	// console.log(bps, index, bps[index])
	return (
		<div>
			<div>Shipyard</div>
			<div>
				<img src="" alt={index} />
				<div>
					<Button onClick={onClickPrevious}>&lt;=</Button>
					<Button onClick={onClickBuy}>Buy</Button>
					{buying ? <input name="name" onKeyDown={onKeyDown} defaultValue={nextShipName} autoFocus /> : ""}
					<div>
						<p>{ship.description}</p>
						<p>Type {ship.type}</p>
					</div>
					<Button onClick={onClickNext}>=&gt;</Button>
				</div>
				<div>
					<label>Starbase</label>
					<div>? :Credits</div>
					<label>Cost</label>
					<div>{ship.cost} :Credits</div>
					<label>Capacity</label>
					<div>{ship.capacity} T. :Payload</div>
					<label>Data</label>
					<div>? :Owned</div>
				</div>
			</div>
		</div>
	)
}

export default Shipyard