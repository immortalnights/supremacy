import { dateAtom } from "Game/store"
import { useAtomValue } from "jotai"

const days_per_month = 60

export function useDate() {
    const date = useAtomValue(dateAtom)

    const month = 1 + (date % days_per_month)
    const year = 2000 + Math.floor(date / days_per_month)

    return `${month}/${year}`
}
