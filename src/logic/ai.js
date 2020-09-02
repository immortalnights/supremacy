import React, { useCallback, useEffect } from 'react'
import { random } from './general'
import { useSetTax, useTransferCredits, useChangeAggression } from '../state/planets'

const compute = () => {

}

const AI = props => {
	const setTax = useSetTax()

	const callback = useCallback(() => {
		// const val = random(0, 101)
		// setTax({ id: 'a' }, val)
	})

	useEffect(() => {
		const timer = setInterval(callback, 500)

		return () => {
			clearInterval(timer)
		}
	});

	return null
}

export default AI