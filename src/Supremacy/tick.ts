import { ColonizedPlanet } from "./entities"
import { isColonizedPlanet } from "./entities"
import type { GameState } from "./types"
import { GameAction, translateAction } from "./actions"
import { simulatePlanets, simulateShips, simulatePlatoons } from "./simulate"
import { processBot } from "./bot/cpu"

/**
 * Modify game state by simulating one tick
 */
export const tick = (initialState: GameState): GameState => {
    let state = { ...initialState, date: initialState.date + 1 }

    ;[state.ships, state.planets] = simulateShips([...state.ships], [...state.planets])
    state.planets = simulatePlanets(state.date, [...state.planets])
    ;[state.platoons, state.planets] = simulatePlatoons([...state.platoons], [...state.planets])

    // Check win/loose conditions
    // For each player,
    // Check that they own all their capital
    // Check that they have available population
    const eliminated = state.players.filter((player) => {
        const ownedPlanets = state.planets.filter(
            (planet) => planet.type !== "lifeless" && planet.owner === player.id,
        ) as ColonizedPlanet[]
        const ownedShips = state.ships.filter((ship) => ship.owner === player.id)
        const ownedPlatoons = state.platoons.filter((platoon) => platoon.owner === player.id)

        const hasCapital = ownedPlanets.some((planet) => planet.capital)
        const hasPopulationOnPlanets = ownedPlanets.reduce((sum, planet) => sum + planet.population, 0) > 0
        // Crew is not counted
        const hasPopulationInShips = ownedShips.reduce((sum, ship) => sum + ship.passengers, 0) > 0
        const hasPopulationInPlatoons = ownedPlatoons.reduce((sum, platoon) => sum + platoon.size, 0) > 0

        let eliminated = false
        if (!hasCapital) {
            // Player is eliminated
            eliminated = true
            console.log(`Player ${player.name} (${player.id}) has last their capital and is eliminated`)
        } else if (!hasPopulationOnPlanets && !hasPopulationInShips && !hasPopulationInPlatoons) {
            // Player is eliminated
            eliminated = true
            console.log(`Player ${player.name} (${player.id}) has no population left and is eliminated`)
        }

        return eliminated
    })

    if (eliminated.length > 0) {
        state.players = [...state.players].map((player) => {
            let modifiedPlayer
            if (eliminated.some((e) => e.id === player.id)) {
                modifiedPlayer = { ...player, eliminated: true }
            }
            return modifiedPlayer || player
        })
    }

    return state
}

export const play = async (
    initialState: GameState,
    actionQueue: GameAction[],
    control: { timer?: number | NodeJS.Timeout; stop?: boolean },
    onStateChange?: (state: GameState) => void,
) => {
    let state = initialState
    if (state.speed === "Paused") {
        state.speed = "Normal"
    }

    let tickCount = 0
    return new Promise<void>((resolve) => {
        const speedIntervals: Record<GameState["speed"], number> = {
            Paused: Infinity,
            Slow: 2000,
            Normal: 1000,
            Fast: 500,
            Turbo: 100,
        }

        let lastTickTime = performance.now()
        let lastBotActionTime = performance.now()
        const botActionInterval = speedIntervals[state.speed] * 3
        let lastSummaryTime = performance.now()
        const summaryInterval = 10000

        const gameLoop = () => {
            const now = performance.now()

            // Process all queued actions (Human + Bot)
            if (actionQueue.length > 0) {
                state = { ...state }
                while (actionQueue.length > 0) {
                    const action = actionQueue.shift()
                    console.debug("Processing action")
                    if (action) state = action(state)
                }
            }

            // Game tick
            const tickInterval = speedIntervals[state.speed]
            if (state.speed !== "Paused" && now - lastTickTime >= tickInterval) {
                tickCount++
                // console.log("Game tick", tickCount, now - lastTickTime)
                state = tick(state)
                lastTickTime = now
            }

            // Bot actions
            if (now - lastBotActionTime >= botActionInterval) {
                for (const player of state.players) {
                    if (player.bot) {
                        console.debug(`Processing Bot actions for ${player.name} (${player.id})`)
                        const action = processBot(player, state.planets, state.ships, state.platoons)

                        if (action) {
                            console.debug("Bot action:", action)
                            actionQueue.push(translateAction(action))
                        }
                    }
                }
                lastBotActionTime = now
            }

            if (now - lastSummaryTime >= summaryInterval) {
                const colonizedPlanets = state.planets.filter(isColonizedPlanet)
                const population = colonizedPlanets.reduce((sum, planet) => sum + planet.population, 0)

                console.debug(
                    `** Game Summary: Date: ${state.date}, Planets: ${colonizedPlanets.length}, Population: ${population} **`,
                )

                lastSummaryTime = now
            }

            if (state.players.every((player) => !player.eliminated) && !control.stop) {
                control.timer = setTimeout(gameLoop, 1000 / 60)
            } else {
                if (control.timer) {
                    clearTimeout(control.timer)
                    control.timer = undefined
                }
                resolve()
            }

            onStateChange?.(state)
        }

        setTimeout(gameLoop, 0)
    })
}

export default await play
