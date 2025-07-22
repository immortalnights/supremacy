import type { ActionObject } from "../actions"

export type BotDifficulty = "Easy" | "Normal" | "Hard" | "Elite"

export type BotActionObject = ActionObject & {
    priority: "High" | "Medium" | "Low"
}
