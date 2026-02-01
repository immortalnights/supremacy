import { test, describe, expect } from "vitest"
import { tick } from "./tick"
import { setup } from "./setup2"
import type { GameState } from "./types"

describe("tick", () => {
    test("should advance the game state by one tick", () => {
        const initialState = setup(
            {
                seed: "test1",
                name: "Test Game",
                difficulty: "Easy",
                // customRules: {
                //     planets: 8, // Custom difficulty can specify the number of planets
                //     resourceMultiplier: 1, // Starting resource multiplier
                // }
            },
            {
                id: "player1",
                name: "Player 1",
                host: true,
                ai: "Easy",
            },
            {
                id: "player1",
                name: "Player 1",
                host: false,
                ai: "Easy",
            },
        )

        expect(initialState.date).toBe(1)

        const newState = tick(initialState)

        expect(newState.date).toBe(2)
        expect(newState.planets).toEqual(initialState.planets)
        expect(newState.ships).toEqual(initialState.ships)
        expect(newState.players).toEqual(initialState.players)
    })

    // Add more tests for specific game mechanics as needed
})
