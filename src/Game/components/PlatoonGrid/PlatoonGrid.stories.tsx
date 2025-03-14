import type { Meta, StoryObj } from "@storybook/react"
import PlatoonGrid from "."
import { fn } from "@storybook/test"
import { equippedPlatoon } from "test/mockData/platoons"

const meta = {
    title: "Components/Platoon Grid",
    component: PlatoonGrid,
    parameters: {
        layout: "centered",
    },
    args: {
        onClick: fn(),
    },
} satisfies Meta<typeof PlatoonGrid>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        platoons: [equippedPlatoon],
    },
}
