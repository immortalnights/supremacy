import { ReactNode } from "react"

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
    onClick?: () => void
    style?: React.CSSProperties
}) {
    return (
        <button
            type={type}
            title={""}
            style={{
                cursor: "pointer",
                width: "auto",
                border: "none",
                background: "transparent",
                textAlign: "left",
                textTransform: "uppercase",
                padding: 0,
                margin: 0,
                ...style,
            }}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
