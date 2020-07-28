import React from 'react'
import SolarSystem from './screens/solarsystem'
import Overview from './screens/overview'
import Shipyard from './screens/shipyard'
import Fleet from './screens/fleet'
import Training from './screens/training'
import Dock from './screens/dock'
import Surface from './screens/surface'
import Combat from './screens/combat'

const Content = props => {
	let content;
	switch (props.screen)
	{
		case 'solarsystem':
		{
			content = (<SolarSystem planet={props.planet} />)
			break
		}
		case 'overview':
		{
			content = (<Overview planet={props.planet} />)
			break
		}
		case 'shipyard':
		{
			content = (<Shipyard planet={props.planet} />)
			break
		}
		case 'fleet':
		{
			content = (<Fleet planet={props.planet} />)
			break
		}
		case 'training':
		{
			content = (<Training planet={props.planet} />)
			break
		}
		case 'dock':
		{
			content = (<Dock planet={props.planet} />)
			break
		}
		case 'surface':
		{
			content = (<Surface planet={props.planet} />)
			break
		}
		case 'combat':
		{
			content = (<Combat planet={props.planet} />)
			break
		}
		default:
		{
			console.error(`Cannot find view ${props.screen}`)
			content = (<div>Not Found</div>)
		}
	}

	return content
}

export default Content