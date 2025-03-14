import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import EntityGrid from "."

const meta = {
    title: "Components/Entity Grid",
    component: EntityGrid,
    parameters: {
        layout: "centered",
    },
    args: {
        onClick: fn(),
    },
} satisfies Meta<typeof EntityGrid>

export default meta
type Story = StoryObj<typeof meta>

export const StartingPlanets: Story = {
    args: {
        entities: [
            { id: "A", name: "EnemyBase", owner: "remote", gridIndex: 0 },
            { id: "B", name: "Starbase!", owner: "local", gridIndex: 31 },
        ],
    },
}

export const NoPlanets: Story = {
    args: { entities: [] },
}

export const FullPlanets: Story = {
    args: {
        entities: Array(32)
            .fill(undefined)
            .map((_, index) => ({
                id: String(index),
                name: `Planet${index}`,
                owner: "local",
                gridIndex: index,
            })),
    },
}

export const Ships: Story = {
    args: {
        entities: [
            { id: "A", name: "Mining1", owner: "local", gridIndex: 0 },
            { id: "B", name: "Mining2", owner: "local", gridIndex: 1 },
        ],
    },
}
