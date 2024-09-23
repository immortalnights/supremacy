import type { Meta, StoryObj } from "@storybook/react"
import CombatAggression from "."
import { fn } from "@storybook/test"

const meta = {
    title: "Components/Combat Aggression",
    component: CombatAggression,
    parameters: {
        layout: "centered",
    },
    args: {
        onIncrease: fn(),
        onDecrease: fn(),
    },
} satisfies Meta<typeof CombatAggression>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        aggression: 25,
    },
}
