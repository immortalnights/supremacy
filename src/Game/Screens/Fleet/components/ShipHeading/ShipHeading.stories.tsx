import type { Meta, StoryObj } from "@storybook/react"
import ShipHeading from "."

const meta = {
    title: "Components/Ship Heading",
    component: ShipHeading,
    parameters: {
        layout: "centered",
    },
    args: {},
} satisfies Meta<typeof ShipHeading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
