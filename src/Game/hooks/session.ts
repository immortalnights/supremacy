import { throwError } from "Supremacy/utilities"
import { sessionAtom } from "Game/store"
import { useAtomValue } from "jotai"

export const useSession = () => {
    const session = useAtomValue(sessionAtom)

    if (!session) {
        throw new Error("Invalid session or local player ID")
    }

    return session
}
