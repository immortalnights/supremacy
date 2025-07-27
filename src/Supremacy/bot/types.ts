import type { ActionObject } from "../actions"

export type BotDifficulty = "Easy" | "Normal" | "Hard" | "Elite"

export type ActionPriority = "High" | "Medium" | "Low"

export type BotActionObject = ActionObject & {
    priority: ActionPriority
}
