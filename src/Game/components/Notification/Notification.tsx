import TypewriterComponent from "typewriter-effect"
import { useClearNotification, useNotification } from "./useNotification"
import { ReactNode } from "react"

export default function Notification({ fallback = null }: { fallback?: ReactNode }) {
    const notification = useNotification()
    const clear = useClearNotification()

    return notification ? (
        <TypewriterComponent
            options={{
                delay: 25,
                deleteSpeed: 1,
            }}
            onInit={(tw) => {
                tw.typeString(notification)
                    .start()
                    .pauseFor(2000)
                    .callFunction(() => clear())
            }}
        />
    ) : (
        (fallback ?? <div>&nbsp;</div>)
    )
}
