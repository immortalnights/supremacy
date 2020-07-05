import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { Button } from 'seventh-component-library'
import shipsAtom from '../../state/ships'

const Shipyard = props => {
	const ships = useRecoilValue(shipsAtom)
	const [ index, setIndex ] = useState('battlecruiser')

	const indexes = Object.keys(ships)

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

	// console.log(ships, index, ships[index])
	const ship = ships[index]
	return (
		<div>
			<div>Shipyard</div>
			<div>
				<img src="" alt={index} />
				<div>
					<Button onClick={onClickPrevious}>&lt;=</Button>
					<Button>Buy</Button>
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