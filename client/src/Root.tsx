import { useContext } from "react"
import { IOContext } from "./data/IOContext"
import { Outlet } from "react-router-dom"

const Root = () => {
    const { connected } = useContext(IOContext)

    return (
        <div>
            {connected ? "Connected" : "Not Connected"}
            <Outlet />
        </div>
    )
}

export default Root
