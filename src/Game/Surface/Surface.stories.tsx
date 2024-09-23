import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import Surface from "."

const meta = {
    title: "Screens/Surface",
    component: Surface,
    parameters: {
        layout: "centered",
    },
    args: {
        onClick: fn(),
    },
} satisfies Meta<typeof Surface>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
