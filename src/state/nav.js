import React from 'react'
import { atom, useRecoilCallback } from 'recoil'

export const viewAtom = atom({
	key: 'view',
	default: { screen: 'overview', planet: 0 }
})

export const useNavigate = () => {
	return useRecoilCallback(({ snapshot, set }) => (screen, planet) => {
		console.log('nav', screen, planet)
		window.history.pushState(null, null, `/game/0/${screen}/${planet || ''}`)

		set(viewAtom, {
			screen: screen,
			planet: planet
		})
	})
}

export const A = props => {
	const navigate = useNavigate()

	const onAClick = e => {
		e.preventDefault()

		navigate(props.screen, props.planet)
	}

	return (<a href={props.href} onClick={onAClick}>{props.children}</a>)
}

export default { viewAtom }