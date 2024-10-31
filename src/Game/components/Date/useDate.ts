import { DAYS_PER_YEAR } from "Game/settings"
import { dateAtom } from "Game/store"
import { useAtomValue } from "jotai"

export function useDate() {
    const date = useAtomValue(dateAtom)

    const month = 1 + (date % DAYS_PER_YEAR)
    const year = 2000 + Math.floor(date / DAYS_PER_YEAR)

    return `${month}/${year}`
}
