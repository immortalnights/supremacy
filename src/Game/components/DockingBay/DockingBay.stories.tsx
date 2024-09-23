import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import DockingBay from "."

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
        planet: { id: 31, name: "Starbase!", owner: "local" },
        ships: [
            {
                id: "zero",
                name: "zero",
                owner: "local",
                location: {
                    planet: 31,
                    position: "docked",
                    index: 1,
                },
                active: false,
            },
        ],
    },
}

export const Empty: Story = {
    args: { planet: { id: 31, name: "Starbase!", owner: "local" }, ships: [] },
}

export const Complete: Story = {
    args: {
        planet: { id: 31, name: "Starbase!", owner: "local" },
        ships: [
            {
                id: "zero",
                name: "zero",
                owner: "local",
                location: {
                    planet: 31,
                    position: "docked",
                    index: 1,
                },
                active: false,
            },
            {
                id: "one",
                name: "one",
                owner: "local",
                location: {
                    planet: 31,
                    position: "docked",
                    index: 2,
                },
                active: false,
            },
            {
                id: "two",
                name: "two",
                owner: "local",
                location: {
                    planet: 31,
                    position: "docked",
                    index: 3,
                },
                active: false,
            },
        ],
    },
}
