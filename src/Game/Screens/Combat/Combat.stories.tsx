import type { Meta, StoryObj } from "@storybook/react"
import Combat from "."

const meta = {
    title: "Screens/Combat",
    component: Combat,
    parameters: {
        layout: "centered",
    },
    args: {},
} satisfies Meta<typeof Combat>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
