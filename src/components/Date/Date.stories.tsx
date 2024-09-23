import type { Meta, StoryObj } from "@storybook/react"
import Date from "."

const meta = {
    title: "Components/Date",
    component: Date,
    parameters: {
        layout: "centered",
    },
    args: {},
} satisfies Meta<typeof Date>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {},
}
