import type { Preview } from "@storybook/react"
import { MemoryRouter } from "react-router-dom"

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        // actions: { argTypesRegex: "^on.*" },
    },
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
}

export default preview
