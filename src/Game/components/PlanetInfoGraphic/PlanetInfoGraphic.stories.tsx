import type { Meta, StoryObj } from "@storybook/react"
import PlanetInfoGraphic from "."
import { lifelessPlanet } from "test/mockData/planets"

const meta = {
    title: "Components/Planet Info Graph",
    component: PlanetInfoGraphic,
    parameters: {
        layout: "centered",
    },
    args: {},
} satisfies Meta<typeof PlanetInfoGraphic>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        planet: lifelessPlanet,
    },
}
