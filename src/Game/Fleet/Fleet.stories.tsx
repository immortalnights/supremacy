import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import Fleet from "."

const meta = {
    title: "Screens/Fleet",
    component: Fleet,
    decorators: [
        (Story) => (
            <div style={{ background: "darkgray" }}>
                <Story />
            </div>
        ),
    ],
    parameters: {
        layout: "centered",
    },
    args: {
        onClick: fn(),
    },
} satisfies Meta<typeof Fleet>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
