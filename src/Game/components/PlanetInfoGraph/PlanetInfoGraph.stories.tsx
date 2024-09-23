import type { Meta, StoryObj } from "@storybook/react"
import PlanetInfoGraph from "."

const meta = {
    title: "Components/Planet Info Graph",
    component: PlanetInfoGraph,
    parameters: {
        layout: "centered",
    },
    args: {},
} satisfies Meta<typeof PlanetInfoGraph>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
