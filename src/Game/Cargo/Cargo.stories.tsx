import type { Meta, StoryObj } from "@storybook/react"
import Cargo from "."

const meta = {
    title: "Screens/Cargo",
    component: Cargo,
    parameters: {
        layout: "centered",
    },
    args: {},
} satisfies Meta<typeof Cargo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
