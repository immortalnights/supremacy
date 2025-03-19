import { setup } from "./Supremacy.cjs"

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

console.log("Game setup complete")
