import type { Meta, StoryObj } from "@storybook/react"
import SolarSystem from "."

const meta = {
    title: "Screens/SolarSystem",
    component: SolarSystem,
    parameters: {
        layout: "centered",
    },
    args: {},
} satisfies Meta<typeof SolarSystem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
