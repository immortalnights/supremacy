import type { Meta, StoryObj } from "@storybook/react"
import SolarSystem from "."
import { colonizedPlanet } from "test/mockData/planets"
import { fn } from "@storybook/test"

const meta = {
    title: "Components/Solar System",
    component: SolarSystem,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: "centered",
    },
    args: {
        selected: undefined,
        localPlayer: undefined,
    },
} satisfies Meta<typeof SolarSystem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        planets: [
            colonizedPlanet,
            colonizedPlanet,
            colonizedPlanet,
            colonizedPlanet,
            colonizedPlanet,
            colonizedPlanet,
            colonizedPlanet,
            colonizedPlanet,
        ],
    },
}
