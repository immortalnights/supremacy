import type { Meta, StoryObj } from "@storybook/react"
import ShipDetails from "."
import { dockedShip } from "test/mockData/ships"

const meta = {
    title: "Components/Ship Details",
    component: ShipDetails,
    parameters: {
        layout: "centered",
    },
    args: {},
} satisfies Meta<typeof ShipDetails>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        ship: dockedShip,
    },
}

export const Empty: Story = {
    args: {
        ship: undefined,
    },
}
