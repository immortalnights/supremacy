import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import ShipLocationGrid from "."
import { surfaceShip } from "test/mockData/ships"
import { colonizedPlanet } from "test/mockData/planets"

const meta = {
    title: "Components/Ship Location Grid",
    component: ShipLocationGrid,
    parameters: {
        layout: "centered",
    },
    args: {
        onClick: fn(),
    },
} satisfies Meta<typeof ShipLocationGrid>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        ships: [surfaceShip],
    },
}

export const Empty: Story = {
    args: { ships: [] },
}

export const Complete: Story = {
    args: {
        ships: [
            { ...surfaceShip, location: { planet: colonizedPlanet.id, index: 0 } },
            { ...surfaceShip, location: { planet: colonizedPlanet.id, index: 1 } },
            { ...surfaceShip, location: { planet: colonizedPlanet.id, index: 2 } },
            { ...surfaceShip, location: { planet: colonizedPlanet.id, index: 3 } },
            { ...surfaceShip, location: { planet: colonizedPlanet.id, index: 4 } },
            { ...surfaceShip, location: { planet: colonizedPlanet.id, index: 5 } },
        ],
    },
}
