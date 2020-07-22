import React, { useEffect, useRef } from 'react'

const Button = props => {
	const DEFAULT_FREQUENCY = 500

	let timer = useRef()
	let duration = useRef(0)
	let frequency = useRef(DEFAULT_FREQUENCY)

	const onHold = event => {
		props.onHold()

		duration.current++
		if (props.frequency === 'scale')
		{
			// console.log(duration.current, frequency.current)
			if (duration.current > 1)
			{
				frequency.current = Math.max(frequency.current * .90, 50)
			}
			else
			{
			}
		}
		else
		{
			frequency.current = props.frequency || frequency.current
		}

		timer.current = setTimeout(onHold, frequency.current)
	}

	const start = () => {
		if (props.onHold)
		{
			onHold()
		}
	}

	const clear = () => {
		if (timer.current)
		{
			frequency.current = DEFAULT_FREQUENCY
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

	return (<button className={props.className} type={props.type || "button"} disabled={props.disabled} onClick={props.onClick} onMouseDown={start} onMouseUp={clear} style={{userSelect: 'none'}}>{props.children}</button>)
}

export default Button