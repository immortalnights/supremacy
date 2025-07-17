import { setup, tick, play } from "./Supremacy.mjs"

// const pvpState = setup(
//     {
//         seed: "test1",
//         name: "Test Game",
//         planetCount: 8,
//         difficulty: "Easy",
//     },
//     {
//         id: "player1",
//         name: "Player 1",
//         host: true,
//         ai: false,
//     },
//     {
//         id: "player1",
//         name: "Player 1",
//         host: false,
//         ai: false,
//     },
// )

// console.log("Player vs Player game setup complete")

// TODO simulate until end game.
// FIXME End game is specifically domination, not elimination, so PvP never ends.

let eveState = setup(
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
        ai: "easy",
    },
    {
        id: "player1",
        name: "Player 1",
        host: false,
        ai: "easy",
    },
)

// TODO simulate until end game.
// FIXME End game condition is not implemented yet, so simulate 100 ticks instead
// while (eveState.date < 100) {
//     eveState = tick(eveState)
// }

// const go = async () => {
//     console.log("Going to play...")
play(eveState).catch((err) => {
    console.error("Error during play:", err)
})
//     console.log("Finished...")
// }
// go().catch((err) => {
//     console.error("Error during simulation:", err)
// })
// console.log("Done...")
