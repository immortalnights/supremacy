import { Provider } from "jotai"
import { Outlet } from "react-router-dom"
import { store } from "./Game/store"

export default function InGame() {
    return (
        <Provider store={store}>
            <Outlet />
        </Provider>
    )
}
