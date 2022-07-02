import React from "react"
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogActions,
} from "@mui/material"

interface NameDialogProps extends DialogProps {
  name: string
  onConfirm: (name: string) => void
  onCancel: () => void
}

interface BaseNameDialogProps extends NameDialogProps {
  title: string
  current?: string
  action: string
}

const NameDialog = ({ title, name, current, action, onConfirm, onCancel, open = true, ...rest }: BaseNameDialogProps) => {
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

  const valid = newName && newName != current

  return (
    <Dialog {...rest} open>
      <DialogTitle>{title}</DialogTitle>
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
        <Button size="small" color="success" disabled={!valid} onClick={() => onConfirm(newName)}>{action}</Button>
      </DialogActions>
    </Dialog>
  )
}

export const RenameDialog = ({ name, ...rest }: NameDialogProps) => {
  const title = `Rename ${name}`
  const action = "Rename"
  return (<NameDialog name={name} current={name} title={title} action={action} {...rest} />)
}

export const NewShipNameDialog = ({ type, name, ...rest }: { type: string } & NameDialogProps) => {
  const title = `Purchase ${type}`
  const action = "Purchase"
  return (<NameDialog name={name} title={title} action={action} {...rest} />)
}