import React from "react"
import Recoil from "recoil"
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogActions
} from "@mui/material"
import { CapitalPlanet } from "../../../data/Planets"
import type { IShip } from "../../../simulation/types.d"

interface DecommissionDialogProps {
  ship: IShip
  onConfirm: (ship: IShip) => void
  onCancel: () => void
}

const DecommissionDialog = (props: DecommissionDialogProps & DialogProps) => {
  const capital = Recoil.useRecoilValue(CapitalPlanet)
  const { ship, onConfirm, onCancel, ...dialogProps } = props

  return (
    <Dialog {...dialogProps}>
      <DialogTitle>Decommission</DialogTitle>
      <DialogContent>
        <DialogContentText textAlign="center">Decommission ship '{ship.name}'?</DialogContentText>
        {capital && <DialogContentText>{capital.name} will receive {ship.value} credits.</DialogContentText>}
      </DialogContent>
      <DialogActions>
        <Button size="small" onClick={onCancel}>Cancel</Button>
        <Button size="small" color="error" onClick={() => onConfirm(ship)}>Decommission</Button>
      </DialogActions>
    </Dialog>
  )
}

export default DecommissionDialog