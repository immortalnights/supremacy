import React from 'react'
import './styles.css'

const InlineName = props => {
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
		<form onSubmit={onSubmit}>
			<div className="inlinename-container">
				<div class="flex-columns"><div></div><label htmlFor="inlinenameinput">{props.message}</label></div>
				<div><input type="text" id="inlinenameinput" name="name" defaultValue={props.value} autoFocus onKeyDown={onKeyDown} /></div>
				<div><button type="submit">OK</button></div>
			</div>
		</form>
	)
}

export default InlineName