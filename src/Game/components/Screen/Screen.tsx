import { CSSProperties, ReactNode } from "react"
import "./Screen.css"

export default function Screen({
    flexDirection,
    children,
}: {
    flexDirection?: CSSProperties["flexDirection"]
    children: ReactNode
}) {
    return (
        <div id="screen" style={{ flexDirection: flexDirection }}>
            {children}
        </div>
    )
}
