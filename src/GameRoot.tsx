import { Provider } from "jotai"
import { Outlet } from "react-router-dom"
import { store } from "./Game/store"
import { Suspense } from "react"

export default function GameRoot() {
    return (
        <Suspense fallback="Loading...">
            <Provider store={store}>
                <Outlet />
            </Provider>
        </Suspense>
    )
}
