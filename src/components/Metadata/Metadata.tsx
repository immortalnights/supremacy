import { CSSProperties, ComponentProps } from "react"

export type MetadataAlignment = "left" | "right"
type TextAlignment = "left" | "right" | "center"

export function MetadataValue({
    label,
    value,
    postfix,
    defaultValue = "",
    textAlign = "right",
}: {
    label: string
    value?: string | number
    postfix?: string
    defaultValue?: string | number
    textAlign?: TextAlignment
}) {
    const displayValue = value ?? defaultValue

    return (
        <div
            aria-labelledby={`${label}-label`}
            style={{
                border: "1px solid lightgray",
                width: textAlign === "center" ? "auto" : 80,
                height: "1em",
                textAlign,
                padding: "1px 8px",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                flex: "1 0 auto",
            }}
        >
            {displayValue}
            {displayValue && postfix ? ` ${postfix}` : ""}
        </div>
    )
}

export function MetadataLabel({
    label,
    textAlign,
}: {
    label: string
    textAlign?: MetadataAlignment
}) {
    return (
        <label
            id={`${label}-label`}
            style={{
                width: 80,
                textAlign,
            }}
        >
            {label}
        </label>
    )
}

/**
 *
 * @param alignment value alignment
 */
export default function Metadata({
    label,
    alignment = "left",
    style,
    ...rest
}: Omit<ComponentProps<typeof MetadataValue>, "textAlign"> & {
    alignment?: MetadataAlignment
    style?: CSSProperties
}) {
    const value = (
        <MetadataValue
            label={label}
            {...rest}
            textAlign={alignment === "left" ? "right" : "left"}
        />
    )

    return (
        <div
            style={{
                display: "flex",
                gap: 6,
                userSelect: "none",
                alignItems: "center",
                ...style,
            }}
        >
            {alignment === "left" && value}
            <MetadataLabel label={label} textAlign={alignment} />
            {alignment === "right" && value}
        </div>
    )
}
