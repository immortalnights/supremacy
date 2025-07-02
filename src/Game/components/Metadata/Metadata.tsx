import { CSSProperties, ComponentProps } from "react"

export type MetadataAlignment = "left" | "right"
type TextAlignment = "left" | "right" | "center"

type MetadataValueType = {
    label: string
    postfix?: string
    textAlign?: TextAlignment
    style?: React.CSSProperties
} & {
    value?: string | number
    format?: ((val: string) => string) | ((val: number) => number)
    defaultValue?: string | number
}

export function MetadataValue({
    label,
    value,
    format,
    postfix,
    defaultValue,
    textAlign = "right",
    style,
}: MetadataValueType) {
    const actualValue = value ?? defaultValue
    // FIXME
    const displayValue =
        format && actualValue ? format(actualValue as never) : actualValue

    return (
        <div
            aria-labelledby={`${label}-label`}
            style={{
                fontFamily: "monospace",
                fontSize: "13px",
                border: "1px solid darkgray",
                width: textAlign === "center" ? "auto" : 80,
                // height: "1em",
                lineHeight: "1em",
                textAlign,
                padding: "0px 8px",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                flex: "1 0 auto",
                ...style,
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
                fontSize: "13px",
                lineHeight: "1em",
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
