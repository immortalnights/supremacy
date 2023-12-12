import React from "react"
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogProps,
    DialogActions,
    List,
    ListItemText,
    ListItemButton,
} from "@mui/material"
import { IPlanetBasic } from "@server/simulation/types"

interface IDialogProps {
    planet: IPlanetBasic
    onConfirm: (planet: IPlanetBasic, mission: string) => void
    onCancel: () => void
}

const EspionageDialog = (props: IDialogProps & DialogProps) => {
    const { planet, onConfirm, onCancel, ...dialogProps } = props
    const [mission, setMission] = React.useState("")

    return (
        <Dialog {...dialogProps}>
            <DialogTitle>Espionage</DialogTitle>
            <DialogContent>
                <List dense>
                    <ListItemButton
                        selected={mission === "resources"}
                        onClick={() => setMission("resources")}
                    >
                        <ListItemText
                            primary="Resources"
                            secondary="1000 Credits"
                        />
                    </ListItemButton>
                    <ListItemButton
                        selected={mission === "population"}
                        onClick={() => setMission("population")}
                    >
                        <ListItemText
                            primary="Population"
                            secondary="1520 Credits"
                        />
                    </ListItemButton>
                    <ListItemButton
                        selected={mission === "warstatus"}
                        onClick={() => setMission("warstatus")}
                    >
                        <ListItemText
                            primary="War Status"
                            secondary="2200 Credits"
                        />
                    </ListItemButton>
                    <ListItemButton
                        selected={mission === "everything"}
                        onClick={() => setMission("everything")}
                    >
                        <ListItemText
                            primary="Everything"
                            secondary="4720 Credits"
                        />
                    </ListItemButton>
                </List>
            </DialogContent>
            <DialogActions>
                <Button size="small" color="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    size="small"
                    color="primary"
                    onClick={() => onConfirm(planet, mission)}
                    disabled={!mission}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EspionageDialog
