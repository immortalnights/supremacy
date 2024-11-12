import { useAtomValue, useSetAtom } from "jotai"
import { useCallback, useEffect, useRef, useState } from "react"
import { notificationAtom } from "./store"

export const useSetNotification = () => {
    const duration = 3000
    const setNotification = useSetAtom(notificationAtom)
    const timeout = useRef<number | undefined>()

    useEffect(() => {
        return () => {
            setNotification(null)

            if (timeout.current) {
                window.clearTimeout(timeout.current)
            }
        }
    }, [])

    const notify = useCallback((message: string) => {
        setNotification(message)

        if (timeout.current) {
            window.clearTimeout(timeout.current)
        }

        timeout.current = window.setTimeout(
            () => {
                console.log("timeout")
                setNotification(null)
            },
            1000 + 50 * message.length,
        )
    }, [])

    return notify
}

export const useNotification = () => {
    return useAtomValue(notificationAtom)
}

export const useClearNotification = () => {
    const setNotification = useSetAtom(notificationAtom)
    return () => {
        console.log("clear")
        setNotification(null)
    }
}
