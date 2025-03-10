import { useNotification } from "./useNotification"

export default function Notification() {
    const notification = useNotification()

    return (
        <div
            style={{
                minHeight: "1.5em",
            }}
        >
            <div
                style={{
                    transition: "opacity 1s",
                    opacity: notification ? 1 : 0,
                }}
            >
                {notification}
            </div>
        </div>
    )
}
