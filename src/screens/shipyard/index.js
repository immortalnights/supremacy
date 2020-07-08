import React, { useState } from 'react'
import { useRecoilState, useRecoilValue, useRecoilCallback } from 'recoil'
import { Button } from 'seventh-component-library'
import store from '../../state/atoms'
import { humanPlayerSelector } from '../../state/game'
import { shipBlueprints, useBuyShip } from '../../state/shipyard'

const Shipyard = props => {
	const ships = useRecoilValue(shipBlueprints)
	const indexes = Object.keys(ships)
	const [ index, setIndex ] = useState(indexes[0])
	const buyShip = useBuyShip(useRecoilValue(humanPlayerSelector))

	const onClickNext = () => {
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

	const onClickPrevious = () => {
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

	const onClickBuy = () => {
		console.log(`buy ${index}`)
		buyShip(index)
	}

	// console.log(ships, index, ships[index])
	const ship = ships[index]
	return (
		<div>
			<div>Shipyard</div>
			<div>
				<img src="" alt={index} />
				<div>
					<Button onClick={onClickPrevious}>&lt;=</Button>
					<Button onClick={onClickBuy}>Buy</Button>
					<div>
						<p>{ship.description}</p>
						<p>Type {ship.type}</p>
					</div>
					<Button onClick={onClickNext}>&gt;=</Button>
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