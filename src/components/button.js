import React, { useEffect, useRef } from 'react'

const DEFAULT_FREQUENCY = 500
const MAX_FREQUENCY = 50
const DEFAULT_MULTIPLIER = 1
const MAX_MULTIPLIER = 100

const Button = props => {
	const timer = useRef()
	const duration = useRef(0)
	const frequency = useRef(DEFAULT_FREQUENCY)
	const multiplier = useRef(DEFAULT_MULTIPLIER)

	const onHold = modifiers => {
		props.onHold(modifiers)

		duration.current++
		if (props.frequency === 'scale')
		{
			if (duration.current > 1)
			{
				frequency.current = Math.max(frequency.current * .90, 50)
			}
		}
		else
		{
			frequency.current = props.frequency || frequency.current
		}

		timer.current = setTimeout(onHold.bind(null, modifiers), frequency.current)
	}

	const start = event => {
		frequency.current = DEFAULT_FREQUENCY
		multiplier.current = DEFAULT_MULTIPLIER

		if (props.onHold)
		{
			const modifiers = {
				ctrl: event.ctrlKey,
				alt: event.altKey
			}

			onHold(modifiers)
		}
	}

	const clear = () => {
		if (timer.current)
		{
			clearTimeout(timer.current)
		}
	}

	useEffect(() => {
		document.addEventListener('mouseup', clear)

		return () => {
			document.removeEventListener('mouseup', clear)
			clear()
		}
	}, [])

	return (<button className={props.className} type={props.type} disabled={props.disabled} onClick={props.onClick} onMouseDown={start} onMouseUp={clear} style={{userSelect: 'none'}}>{props.children}</button>)
}

Button.defaultProps = {
	type: 'button',
	disabled: false,
	onClick: () => {},
	onHold: undefined,
	frequency: undefined
}

export default Button