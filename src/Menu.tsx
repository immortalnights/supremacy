import { useManager } from "webrtc-lobby-lib"
import { useNavigate } from "react-router-dom"

const Menu = () => {
    const { joinLobby } = useManager()
    const navigate = useNavigate()

    const handleMultiplayerClick = async () => {
        await joinLobby()
        navigate("/Lobby")
    }

    return (
        <div>
            <button disabled>Continue</button>
            <button onClick={() => navigate("/Create")}>New Game</button>
            <button onClick={handleMultiplayerClick}>Multiplayer</button>
        </div>
    )
}

export default Menu
