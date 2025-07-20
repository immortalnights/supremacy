import { setup, play } from "./Supremacy.mjs"
import type { GameState, GameConfiguration, Player } from "./src/Supremacy/types"
import type { GameAction } from "./src/Supremacy/actions"

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

let eveState: GameState = setup(
    {
        seed: "test1",
        name: "Test Game",
        difficulty: "Easy",
    } satisfies GameConfiguration,
    {
        id: "player1",
        name: "Player 1",
        host: true,
        ai: "Easy",
        eliminated: false,
    } satisfies Player,
    {
        id: "player2",
        name: "Player 2",
        host: false,
        ai: "Easy",
        eliminated: false,
    } satisfies Player,
)

eveState.speed = "Turbo"
// TODO simulate until end game.
// FIXME End game condition is not implemented yet, so simulate 100 ticks instead
// while (eveState.date < 100) {
//     eveState = tick(eveState)
// }

const actionQueue: GameAction[] = []
play(eveState, actionQueue, {}, undefined)
    .then(() => {
        console.error("Game over")
    })
    .catch((err) => {
        console.error("Error during play:", err)
    })
//     console.log("Finished...")
// }
// go().catch((err) => {
//     console.error("Error during simulation:", err)
// })
// console.log("Done...")
