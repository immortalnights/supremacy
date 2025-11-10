import { useManager } from "webrtc-lobby-lib"
import { useNavigate } from "react-router-dom"
import { MenuButton } from "components/Button"
import { useAtomValue } from "jotai"
import { gameStateAtom } from "Game/store"

export default function Main() {
    const { joinLobby } = useManager()
    const navigate = useNavigate()
    const savedGame = useAtomValue(gameStateAtom)

    const handleMultiplayerClick = async () => {
        await joinLobby()
        navigate("/Lobby")
    }

    return (
        <div>
            <MenuButton
                disabled={!savedGame}
                onClick={() => (savedGame ? navigate(`/Game/${savedGame.id}/`) : undefined)}
            >
                Continue
            </MenuButton>
            <MenuButton onClick={() => navigate("/Create")}>New Game</MenuButton>
            <MenuButton onClick={() => navigate("/Load")}>Load Game</MenuButton>
            <MenuButton onClick={handleMultiplayerClick}>Multiplayer</MenuButton>
        </div>
    )
}
