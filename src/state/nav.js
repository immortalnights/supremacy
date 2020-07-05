import { atom, useSetRecoilState } from 'recoil'

const view = atom({
	key: 'view',
	default: { screen: 'overview', planet: 0 }
})

const useViewState = (screen, planet) => {
	const setView = useSetRecoilState(view)
	// console.log(screen, planet)
	setView({ screen, planet })
}

export default { view }