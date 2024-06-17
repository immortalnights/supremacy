import { Provider } from "jotai"
import { Link, Outlet } from "react-router-dom"
import { store } from "./Game/store"

export default function InGame() {
    return (
        <Provider store={store}>
            <Outlet />
            <div>
                <Link to={"/Create"}>Restart</Link>
            </div>
        </Provider>
    )
}
