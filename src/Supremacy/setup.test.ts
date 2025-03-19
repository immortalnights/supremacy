import { setup } from "Supremacy"
import { test, expect, describe } from "vitest"

test("test basic multiplayer setup", () => {
    const state = setup(
        {
            name: "Test Game",
            difficulty: "Easy",
        },
        {
            id: "player1",
            name: "Player 1",
            host: true,
            ai: false,
        },
        {
            id: "player2",
            name: "Player 2",
            host: false,
            ai: false,
        },
    )

    expect(state.planets).toHaveLength(8)
    expect(state.ships).toHaveLength(0)
    expect(state.platoons).toHaveLength(48)
})

test("consistent planet types with consistent seed", () => {
    const state1 = setup(
        {
            seed: "consistent-seed",
            name: "Test Game",
            difficulty: "Easy",
        },
        {
            id: "player1",
            name: "Player 1",
            host: true,
            ai: false,
        },
        {
            id: "player2",
            name: "Player 2",
            host: false,
            ai: false,
        },
    )

    expect(state1.planets).toHaveLength(8)

    const state2 = setup(
        {
            seed: "consistent-seed",
            name: "Test Game",
            difficulty: "Easy",
        },
        {
            id: "player1",
            name: "Player 1",
            host: true,
            ai: false,
        },
        {
            id: "player2",
            name: "Player 2",
            host: false,
            ai: false,
        },
    )

    expect(state2.planets).toHaveLength(8)

    state1.planets.forEach((planet, index) => {
        expect(planet.type).toEqual(state2.planets[index].type)
    })
})

describe("test invalid player configurations", () => {
    test.fails("duplicate player ids", () => {
        expect(() =>
            setup(
                {
                    name: "Test Game",
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
                    name: "Player 2",
                    host: false,
                    ai: false,
                },
            ),
        ).toThrowError()
    })

    test.fails("multiple hosts", () => {
        expect(() =>
            setup(
                {
                    name: "Test Game",
                    difficulty: "Easy",
                },
                {
                    id: "player1",
                    name: "Player 1",
                    host: true,
                    ai: false,
                },
                {
                    id: "player2",
                    name: "Player 2",
                    host: true,
                    ai: false,
                },
            ),
        ).toThrowError()
    })
})
