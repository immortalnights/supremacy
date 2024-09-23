import { useManager } from "webrtc-lobby-lib"
import { useNavigate } from "react-router-dom"
import { useMemo } from "react"
import { LastSaveData } from "../Game/types"

export default function Main() {
    const { joinLobby } = useManager()
    const navigate = useNavigate()
    const savedGame = useMemo((): LastSaveData | undefined => {
        const lastSave = localStorage.getItem("last-save")
        let data

        if (lastSave) {
            data = JSON.parse(lastSave) as LastSaveData
        }

        return data
    }, [])

    const handleMultiplayerClick = async () => {
        await joinLobby()
        navigate("/Lobby")
    }

    return (
        <div>
            <button
                disabled={!savedGame}
                onClick={() =>
                    savedGame ? navigate(`/Game/${savedGame.id}/`) : undefined
                }
            >
                Continue
            </button>
            <button onClick={() => navigate("/Create")}>New Game</button>
            <button onClick={handleMultiplayerClick}>Multiplayer</button>
        </div>
    )
}
