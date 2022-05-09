import React from "react"
import Recoil from "recoil"
import {
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogActions,
  Input
} from "@mui/material"

interface RenameDialogProps {
  name: string
  onConfirm: (name: string) => void
  onCancel: () => void
}

const RenameDialog = ({ name, onConfirm, onCancel, open = true, ...rest }: RenameDialogProps & DialogProps ) => {
  const [ newName, setNewName ] = React.useState(name)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (newName)
    {
      onConfirm(newName)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape")
    {
      onCancel()
    }
  }

  return (
    <Dialog {...rest} open>
      <DialogTitle>Rename '{name}'</DialogTitle>
      <DialogContent>
        <DialogContentText>
            <form onSubmit={handleSubmit}>
              <TextField
                name="itemname"
                id="itemname"
                label="Name"
                variant="standard"
                defaultValue={name}
                onChange={(event) => setNewName(event.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={(event: React.FocusEvent<HTMLInputElement>) => event.target.select()}
                autoFocus
                autoComplete="off" />
            </form>
          </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button size="small" onClick={onCancel}>Cancel</Button>
        <Button size="small" color="success" disabled={!newName} onClick={() => onConfirm(newName)}>Rename</Button>
      </DialogActions>
    </Dialog>
  )
}

export default RenameDialog