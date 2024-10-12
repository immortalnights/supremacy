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

export function MenuButton({
    type = "button",
    disabled = false,
    onClick,
    children,
}: {
    type?: HTMLButtonElement["type"]
    disabled?: boolean
    onClick?: MouseEventHandler
    children: ReactNode
}) {
    return (
        <Button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={{
                padding: 8,
                backgroundColor: "darkgray",
                borderRadius: 6,
                margin: 4,
            }}
        >
            {children}
        </Button>
    )
}
