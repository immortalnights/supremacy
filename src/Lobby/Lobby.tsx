import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Lobby as RTCLobby, useManager } from "webrtc-lobby-lib"

export default function Lobby() {
    const navigate = useNavigate()
    const { state } = useManager()

    useEffect(() => {
        if (state === "in-game") {
            navigate("/Game/Setup", {})
        }
    }, [state, navigate])

    return (
        <div>
            {state === "lobby" ? <RTCLobby></RTCLobby> : "Connecting..."}
            <button type="button" onClick={() => navigate("/")}>
                Cancel
            </button>
        </div>
    )
}
