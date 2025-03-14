import type { Meta, StoryObj } from "@storybook/react"
import Metadata, { MetadataLabel, MetadataValue } from "."

const meta = {
    title: "Components/Metadata",
    component: Metadata,
    decorators: [
        (Story) => (
            <div style={{ width: "300px", border: "0px solid lightblue" }}>
                <Story />
            </div>
        ),
    ],
    argTypes: {
        postfix: { type: "string" },
        defaultValue: { type: "string" },
    },
    parameters: {
        layout: "centered",
    },
    args: {
        alignment: "left",
    },
} satisfies Meta<typeof Metadata>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        label: "Label",
        value: "Value",
        postfix: undefined,
    },
}

export const Empty: Story = {
    args: {
        label: "Label",
        value: "",
    },
}

export const DoubleLabel: Story = {
    decorators: [
        () => (
            <div style={{ display: "flex", gap: 6 }}>
                <MetadataLabel label="Label" textAlign="right" />
                <MetadataValue label="Label" value="Value" textAlign="center" />
                <MetadataLabel label="Label" />
            </div>
        ),
    ],
    args: {
        label: "Label",
        value: "",
    },
}
