import { test, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Provider } from "jotai"
import Date from "."
import { dateAtom } from "../../store"
import { useHydrateAtoms } from "jotai/utils"
import { ReactNode } from "react"

const HydrateAtoms = ({ value, children }: { value: number; children: ReactNode }) => {
    useHydrateAtoms([[dateAtom, value]] as const)
    return children
}

const DateProvider = ({ value = 0 }: { value?: number }) => {
    return (
        <Provider>
            <HydrateAtoms value={value}>
                <Date />
            </HydrateAtoms>
        </Provider>
    )
}

test("render basic date", () => {
    render(<DateProvider />)
    expect(screen.getByLabelText("Date").textContent).toEqual("1/2000")
})

test("render basic date", () => {
    render(<DateProvider value={200} />)
    expect(screen.getByLabelText("Date").textContent).toEqual("9/2003")
})
