import { useManager } from "webrtc-lobby-lib"
import { useNavigate } from "react-router-dom"
import { useMemo } from "react"
import { LastSaveData } from "../Game/types"
import { MenuButton } from "components/Button"

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
            <MenuButton
                disabled={!savedGame}
                onClick={() =>
                    savedGame ? navigate(`/Game/${savedGame.id}/`) : undefined
                }
            >
                Continue
            </MenuButton>
            <MenuButton onClick={() => navigate("/Create")}>
                New Game
            </MenuButton>
            <MenuButton onClick={handleMultiplayerClick}>
                Multiplayer
            </MenuButton>
        </div>
    )
}
