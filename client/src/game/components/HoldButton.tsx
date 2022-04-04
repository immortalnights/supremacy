import React from "react"
import { Button, ButtonProps } from "@mui/material"

const HoldButton = ({ onHold, children, ...rest }: { onHold: (modifier: boolean) => void, children: JSX.Element | string, rest?: ButtonProps }) => {
  const intervalRef = React.useRef<number | undefined>(undefined)
  const didHoldRef = React.useRef<boolean>(false)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (didHoldRef.current === false)
    {
      onHold(event.ctrlKey)
      didHoldRef.current = false
    }
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    didHoldRef.current = false
    if (!intervalRef.current)
    {
      intervalRef.current = window.setInterval(() => {
        didHoldRef.current = true
        onHold(event.ctrlKey)
      }, 100)
    }
  }

  const handleMouseUp = (event: React.MouseEvent<HTMLButtonElement>) => {
    window.clearInterval(intervalRef.current)
    intervalRef.current = undefined
  }

  React.useEffect(() => {
    return () => window.clearInterval(intervalRef.current)
  }, [])

  return <Button onClick={handleClick} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} {...rest} >{children}</Button>
}

export default HoldButton