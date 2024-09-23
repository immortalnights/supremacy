import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import PlanetDetails from "."

const meta = {
    title: "Components/Planet Details",
    component: PlanetDetails,
    parameters: {
        layout: "centered",
    },
    args: {
        onIncreaseTax: fn(),
        onDecreaseTax: fn(),
    },
} satisfies Meta<typeof PlanetDetails>

export default meta
type Story = StoryObj<typeof meta>

export const OwnedPlanet: Story = {
    args: {
        planet: {
            id: 1,
            name: "Starbase!",
            owner: "local",
            credits: 1234,
            food: 25,
            minerals: 25,
            fuels: 25,
            energy: 25,
            population: 120,
            growth: 5,
            moral: 5,
            tax: 1,
            strength: 10000,
        },
    },
}

export const EnemyPlanet: Story = {
    args: {
        planet: {
            id: 1,
            name: "Enemy Base",
            owner: "remote",
        },
    },
}

export const UnterraformedPlanet: Story = {
    args: {
        planet: {
            id: 1,
            name: "??",
            type: "uninhabited",
        },
    },
}
