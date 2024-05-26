import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import PlanetList from "."

const meta = {
    title: "Components/Planet List",
    component: PlanetList,
    parameters: {
        layout: "centered",
    },
    args: {
        onClick: fn(),
    },
} satisfies Meta<typeof PlanetList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        planets: [
            { id: 0, name: "EnemyBase", owner: "remote" },
            { id: 31, name: "Starbase!", owner: "local" },
        ],
    },
}

export const Empty: Story = {
    args: { planets: [] },
}

export const Complete: Story = {
    args: {
        planets: Array(32)
            .fill(undefined)
            .map((_, index) => ({
                id: index,
                name: `Planet${index}`,
                owner: "local",
            })),
    },
}
