import { ReactNode } from "react"

export default function Button({
    children,
    onClick,
    style,
}: {
    children: ReactNode
    onClick: () => void
    style: React.CSSProperties | undefined
}) {
    return (
        <button
            title={""}
            style={{
                cursor: "pointer",
                width: "100%",
                border: "none",
                background: "transparent",
                textAlign: "left",
                textTransform: "uppercase",
                padding: 0,
                margin: 0,
                ...style,
            }}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
