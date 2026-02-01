import { BotActionObject } from "../types"

/**
 * Pushes an action to the actions array if it is defined. Some bot functions may return undefined if no action is needed.
 * @param action The action to push.
 * @param actions The array of actions to push to.
 */
export const pushAction = (action: BotActionObject | undefined, actions: BotActionObject[]) => {
    if (action) {
        actions.push(action)
    }
}
