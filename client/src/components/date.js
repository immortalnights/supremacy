import React from 'react'
import { useRecoilValue } from 'recoil'
import date from '../logic/date'
import atoms from '../state/atoms'

export const DateDisplay = props => {
	return (<span>{date.format(props.date)}</span>)
}

const StarDate = props => {
	const currentDate = useRecoilValue(atoms.date)

	return (<DateDisplay date={currentDate} />)
}

export default StarDate