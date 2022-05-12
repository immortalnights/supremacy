import React from 'react'
import PropTypes from 'prop-types'
import Button from '../../../old/button'
import './styles.css'


// const UNUSED_InlineName = ({ label, value, onCancel, onComplete }: any) => {
//   const [ name, setName ] = React.useState(value)

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault()
//     onComplete(name)
//   }

//   const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === "Escape")
//     {
//       onCancel()
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <TextField
//         name="planetname"
//         id="planetname"
//         label={label}
//         variant="standard"
//         defaultValue={name}
//         onChange={(event) => setName(event.target.value)}
//         onKeyDown={handleKeyDown}
//         onFocus={(event: React.FocusEvent<HTMLInputElement>) => event.target.select()}
//         autoFocus
//         autoComplete="off" />
//     </form>
//   )
// }

const InlineName = props => {
	const onSubmit = event => {
		event.preventDefault()

		const form = event.target
		const val = form.name.value

		if (val && props.onComplete)
		{
			props.onComplete(val)
		}
	}

	const onKeyDown = event => {
		switch (event.key)
		{
			case 'Escape':
			{
				if (props.onCancel)
				{
					props.onCancel()
				}
				break
			}
			default:
			{
				break
			}
		}
	}

	return (
		<div style={{display: 'inline: block'}}>
			<form onSubmit={onSubmit}>
				<div className="inlinename-container">
					<div className="flex-columns"><div></div><label htmlFor="inlinenameinput">{props.message}</label></div>
					<div><input type="text" id="inlinenameinput" name="name" defaultValue={props.value} placeholder={props.placeholder} autoFocus onKeyDown={onKeyDown} onFocus={e => e.target.select()} /></div>
					<div><button type="submit">OK</button></div>
					<div><Button onClick={props.onCancel}>Cancel</Button></div>
				</div>
			</form>
		</div>
	)
}

InlineName.propTypes = {
	onComplete: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	value: PropTypes.string,
	message: PropTypes.string,
	placeholder: PropTypes.string
}

export default InlineName