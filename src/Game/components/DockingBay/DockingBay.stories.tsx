import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import DockingBay from "."
import { colonizedPlanet } from "test/mockData/planets"

const meta = {
    title: "Components/Docking Bay",
    component: DockingBay,
    parameters: {
        layout: "centered",
    },
    args: {
        onClick: fn(),
    },
} satisfies Meta<typeof DockingBay>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        planet: colonizedPlanet,
    },
}

export const Empty: Story = {
    args: { planet: colonizedPlanet },
}

export const Complete: Story = {
    args: {
        planet: colonizedPlanet,
    },
}
