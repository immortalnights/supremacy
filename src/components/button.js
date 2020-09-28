import React, { useEffect, useRef } from 'react'

const DEFAULT_FREQUENCY = 500
const MAX_FREQUENCY = 50
const DEFAULT_MULTIPLIER = 1
const MAX_MULTIPLIER = 100

const Button = props => {
	const timer = useRef()
	const duration = useRef(0)
	const freq = useRef(DEFAULT_FREQUENCY)
	const multiplier = useRef(DEFAULT_MULTIPLIER)

	const { onHold, frequency, ...attr } = props

	const onButtonHold = modifiers => {
		props.onHold(modifiers)

		duration.current++
		if (frequency === 'scale')
		{
			if (duration.current > 1)
			{
				freq.current = Math.max(freq.current * .90, 50)
			}
		}
		else
		{
			freq.current = frequency || freq.current
		}

		timer.current = setTimeout(onHold.bind(null, modifiers), freq.current)
	}

	const start = event => {
		freq.current = DEFAULT_FREQUENCY
		multiplier.current = DEFAULT_MULTIPLIER

		if (props.onHold)
		{
			const modifiers = {
				ctrl: event.ctrlKey,
				alt: event.altKey
			}

			onButtonHold(modifiers)
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

	if (attr.style)
	{

		console.log("***", attr.style)
	}

	return (<button { ...attr } onMouseDown={start} onMouseUp={clear}>{props.children}</button>)
}

Button.defaultProps = {
	type: 'button',
	disabled: false,
	onClick: () => {},
	onHold: undefined,
	frequency: undefined
}

export default Button