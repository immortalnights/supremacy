import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useCallback, useEffect, useRef, useState } from "react"
import { notificationAtom } from "./store"

export type NotifyCallback = (message: string) => void

export const useSetNotification = (): NotifyCallback => {
    const duration = 3000
    const [notification, setNotification] = useAtom(notificationAtom)
    const timeout = useRef<number | undefined>()

    // clear the notification if the hook unmounts
    useEffect(() => {
        return () => {
            setNotification(null)

            if (timeout.current) {
                window.clearTimeout(timeout.current)
            }
        }
    }, [])

    // clear the notification after a set timeout
    useEffect(() => {
        if (timeout.current) {
            window.clearTimeout(timeout.current)
        }

        if (notification) {
            timeout.current = window.setTimeout(() => {
                setNotification(null)
            }, duration)
        }
    }, [notification])

    const notify = useCallback((message: string) => {
        setNotification(message)

        // if (timeout.current) {
        //     window.clearTimeout(timeout.current)
        // }

        // timeout.current = window.setTimeout(
        //     () => {
        //         console.log("timeout")
        //         // setNotification(null)
        //     },
        //     1000 + 50 * message.length,
        // )
    }, [])

    return notify
}

export const useNotification = () => {
    return useAtomValue(notificationAtom)
}

export const useClearNotification = () => {
    const setNotification = useSetAtom(notificationAtom)
    return () => {
        setNotification(null)
    }
}
