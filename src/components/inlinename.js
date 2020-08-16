import React, { useState } from 'react'

const InlineName = props => {
	const [ name, setName ] = useState()

	const onSubmit = event => {
		event.preventDefault()

		const form = event.target

		props.onSetName(form.name.value)
	}

	const onKeyDown = event => {
		switch (event.key)
		{
			// case 'Enter':
			// {
			// 	if (e.target.value)
			// 	{
			// 		buyShip(index, e.target.value)
			// 		setBuying(false)
			// 	}
			// 	break
			// }
			case 'Escape':
			{
				props.onCancel()
				break
			}
			default:
			{
				break
			}
		}
	}

	return (
		<div>
			<form onSubmit={onSubmit}>
				<label htmlFor="inlinenameinput">{props.message}</label>
				<input type="text" id="inlinenameinput" name="name" defaultValue={props.value} autoFocus onKeyDown={onKeyDown} />
			</form>
		</div>
	)
}

export default InlineName