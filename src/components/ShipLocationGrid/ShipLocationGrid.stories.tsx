import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import ShipLocationGrid from "."

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
        ships: [
            {
                id: "zero",
                name: "zero",
                owner: "local",
                location: {
                    planet: 31,
                    position: "landed",
                    index: 1,
                },
                active: false,
            },
        ],
    },
}

export const Empty: Story = {
    args: { ships: [] },
}

export const Complete: Story = {
    args: {
        ships: [
            {
                id: "zero",
                name: "zero",
                owner: "local",
                location: {
                    planet: 31,
                    position: "landed",
                    index: 1,
                },
                active: true,
            },
            {
                id: "one",
                name: "one",
                owner: "local",
                location: {
                    planet: 31,
                    position: "landed",
                    index: 2,
                },
                active: true,
            },
            {
                id: "two",
                name: "two",
                owner: "local",
                location: {
                    planet: 31,
                    position: "landed",
                    index: 3,
                },
                active: false,
            },
            {
                id: "three",
                name: "three",
                owner: "local",
                location: {
                    planet: 31,
                    position: "landed",
                    index: 4,
                },
                active: false,
            },
            {
                id: "four",
                name: "four",
                owner: "local",
                location: {
                    planet: 31,
                    position: "landed",
                    index: 5,
                },
                active: false,
            },
            {
                id: "five",
                name: "five",
                owner: "local",
                location: {
                    planet: 31,
                    position: "landed",
                    index: 6,
                },
                active: false,
            },
        ],
    },
}
