import { setup } from "Supremacy"
import { test, expect } from "vitest"

test("test basic multiplayer setup", () => {
    const state = setup(
        {
            seed: "test1",
            name: "Test Game",
            planetCount: 8,
            difficulty: "Easy",
        },
        {
            id: "player1",
            name: "Player 1",
            host: true,
            ai: false,
        },
        {
            id: "player1",
            name: "Player 1",
            host: false,
            ai: false,
        },
    )

    expect(state.planets).toHaveLength(8)
    expect(state.ships).toHaveLength(0)
    expect(state.platoons).toHaveLength(48)
})
