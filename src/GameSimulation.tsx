import { Provider } from "jotai"
import { Outlet } from "react-router-dom"
import { store } from "./Game/store"
import { CommandProvider } from "./CommandContext"

function Simulation() {
    // const setState = useSetAtom(stateAtom)

    // useEffect(() => {
    //     setState("playing")

    //     return () => {
    //         setState("paused")
    //     }
    // }, [setState])

    return null
}

export function GameSimulation() {
    return (
        <>
            {/* <Provider store={store}> */}
            <Simulation />
            <CommandProvider>
                <Outlet />
            </CommandProvider>
            {/* </Provider> */}
        </>
    )
}
