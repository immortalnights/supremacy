import { test, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Provider } from "jotai"
import Date from "."
import { dateAtom } from "../../store"
import { useHydrateAtoms } from "jotai/utils"
import { ReactNode } from "react"

const HydrateAtoms = ({
    initialValues,
    children,
}: {
    initialValues: Parameters<typeof useHydrateAtoms>[0]
    children: ReactNode
}) => {
    useHydrateAtoms(initialValues)
    return children
}

const TestProvider = ({
    initialValues,
    children,
}: {
    initialValues: Parameters<typeof useHydrateAtoms>[0]
    children: ReactNode
}) => (
    <Provider>
        <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
    </Provider>
)

const DateProvider = ({ value = 0 }: { value?: number }) => {
    return (
        <TestProvider initialValues={[[dateAtom, value]]}>
            <Date />
        </TestProvider>
    )
}

test("render basic date", () => {
    render(<DateProvider />)
    expect(screen.getByLabelText("Date").textContent).toEqual("1/2000")
})

test("render basic date", () => {
    render(<DateProvider value={200} />)
    expect(screen.getByLabelText("Date").textContent).toEqual("21/2003")
})
