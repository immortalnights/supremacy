import store from './atoms'
import { viewAtom } from './nav'

const initializeState = ({set}) => {
	let pathName = window.location.pathname
	pathName = pathName.replace(/\/game\/([\d]+)?/, '')

	const location = {
		screen: 'solarsystem',
		planet: playerCapital.id
	}

	if (pathName)
	{
		const match = pathName.match(/([\w]+)\/([\w\d]+)/)
		if (match)
		{
			location.screen = match[1]
			location.planet = match[2]
		}
	}

	set(viewAtom, location)
}

export default initializeState