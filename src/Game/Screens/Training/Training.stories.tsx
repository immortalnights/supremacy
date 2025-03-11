import type { Meta, StoryObj } from "@storybook/react"
import Training from "."

const meta = {
    title: "Screens/Training",
    component: Training,
    parameters: {
        layout: "centered",
    },
    args: {},
} satisfies Meta<typeof Training>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
