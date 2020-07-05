import React from 'react'
import { atom, useSetRecoilState } from 'recoil'

export const viewAtom = atom({
	key: 'view',
	default: { screen: 'overview', planet: 0 }
})

export const A = props => {
	const setView = useSetRecoilState(viewAtom)

	// console.log(props)

	const onAClick = e => {
		e.preventDefault()

		console.log('nav', props.screen, props.planet)
		window.history.pushState(null, null, `/game/0/${props.screen}/${props.planet || ''}`)

		setView({
			screen: props.screen,
			planet: props.planet
		})
	}

	return (<a href="/" onClick={onAClick}>{props.children}</a>)
}

export default { viewAtom }