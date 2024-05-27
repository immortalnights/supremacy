import type { Meta, StoryObj } from "@storybook/react"
import ShipDetails from "."

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
        ship: {
            id: "zero",
            name: "zero",
            owner: "local",
            class: "Class Unknown",
            crew: 0,
            fuel: 0,
            location: {
                planet: 31,
                position: "landed",
                index: 1,
            },
            active: true,
        },
    },
}

export const Empty: Story = {
    args: {
        ship: undefined,
    },
}
