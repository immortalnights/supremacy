import type { Meta, StoryObj } from "@storybook/react"
import Shipyard from "."

const meta = {
    title: "Screens/Shipyard",
    component: Shipyard,
    parameters: {
        layout: "centered",
    },
    args: {},
} satisfies Meta<typeof Shipyard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
