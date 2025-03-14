import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import PlanetSurface from "."
import { colonizedPlanet } from "test/mockData/planets"

const meta = {
    title: "Components/Planet Surface",
    component: PlanetSurface,
    parameters: {
        layout: "centered",
    },
    args: {},
} satisfies Meta<typeof PlanetSurface>

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
