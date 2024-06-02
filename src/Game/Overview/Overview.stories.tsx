import type { Meta, StoryObj } from "@storybook/react"
import Overview from "."

const meta = {
    title: "Screens/Overview",
    component: Overview,
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
    args: {},
} satisfies Meta<typeof Overview>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
