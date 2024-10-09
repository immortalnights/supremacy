import { ReactNode, MouseEventHandler } from "react"

export default function Button({
    children,
    type = "button",
    disabled = false,
    onClick,
    style,
}: {
    children: ReactNode
    type?: HTMLButtonElement["type"]
    disabled?: boolean
    onClick?: MouseEventHandler
    style?: React.CSSProperties
}) {
    return (
        <button
            type={type}
            title={""}
            style={{
                ...style,
            }}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
