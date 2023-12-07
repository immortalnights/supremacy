import React from "react"
import { Button, IconButton } from "@mui/material"
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material"
import { red, green } from "@mui/material/colors"

interface IncreaseDecreaseButtonProps {
    mode: "increase" | "decrease"
    onChange: (event: React.MouseEvent, value: number) => void
    disabled?: boolean
    baseChange?: number
    multiplier?: number
    allowAltModifier?: boolean
    grayscale?: boolean
    label?: string
}

const IncreaseDecreaseButton = ({
    mode,
    onChange,
    disabled = false,
    baseChange = 1,
    multiplier = 10,
    allowAltModifier = false,
    grayscale = false,
    label,
}: IncreaseDecreaseButtonProps) => {
    const [timer, setTimer] = React.useState<number | undefined>(undefined)

    const fire = (event: React.MouseEvent, ctrl: boolean, alt: boolean) => {
        let change = 0
        if (mode === "increase") {
            change = baseChange
        } else if (mode === "decrease") {
            change = -baseChange
        }

        // alt modifier switches the direction
        if (allowAltModifier && alt) {
            change = -change
        }

        // ctrl modifier multiplies the change value by 10
        if (ctrl) {
            change *= multiplier
        }

        onChange(event, change)
    }

    const cancel = () => {
        window.clearInterval(timer)
        setTimer(undefined)
    }

    const handleClick = (event: React.MouseEvent) => {}

    const handleMouseDown = (event: React.MouseEvent) => {
        fire(event, event.ctrlKey, event.altKey)
        const t = window.setInterval(
            () => fire(event, event.ctrlKey, event.altKey),
            100
        )
        setTimer(t)
    }

    const handleMouseUp = (event: React.MouseEvent) => {
        cancel()
    }

    const handleMouseBlur = (event: React.FocusEvent) => {
        cancel()
    }

    const handleMouseLeave = (event: React.MouseEvent) => {
        cancel()
    }

    React.useEffect(() => cancel(), [setTimer])

    const props = {
        disabled,
        onClick: handleClick,
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
        onBlur: handleMouseBlur,
        onMouseLeave: handleMouseLeave,
    }

    let content
    if (label) {
        content = (
            <Button {...props} size="small">
                {label}
            </Button>
        )
    } else {
        let icon
        if (mode === "increase") {
            icon = <ArrowDropUp sx={!grayscale ? { color: green[500] } : {}} />
        } else if (mode === "decrease") {
            icon = <ArrowDropDown sx={!grayscale ? { color: red[500] } : {}} />
        }

        content = (
            <IconButton {...props} size="small">
                {icon}
            </IconButton>
        )
    }

    return content
}

export default IncreaseDecreaseButton
