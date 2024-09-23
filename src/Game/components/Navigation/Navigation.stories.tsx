import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import Navigation from "."

const meta = {
    title: "Components/Navigation",
    component: Navigation,
    parameters: {
        layout: "centered",
    },
    args: {
        onClick: fn(),
    },
} satisfies Meta<typeof Navigation>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
    args: {
        items: [
            "overview",
            "shipyard",
            "fleet",
            "atmos",
            "training",
            "cargo",
            "surface",
            "combat",
            "spy",
            "save",
        ],
    },
}
