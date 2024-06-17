import { useNavigate } from "react-router-dom"

const Menu = () => {
    const navigate = useNavigate()

    return (
        <div>
            <button disabled>Continue</button>
            <button onClick={() => navigate("/Create")}>New Game</button>
            <button>Multiplayer</button>
        </div>
    )
}

export default Menu
