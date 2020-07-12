import React from 'react'
import { useRecoilValue } from 'recoil'
import atoms from '../state/atoms'

const StarDate = props => {
	const date = useRecoilValue(atoms.date)

	return (<span>{date.m} / {date.y}</span>)
}

export default StarDate