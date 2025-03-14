import { MenuButton } from "components/Button"
import { Form, useNavigate } from "react-router-dom"

// TODO Two player cards, on CPU or Remote player. No "lobby", etc.

export default function CreateGame() {
    const navigate = useNavigate()

    return (
        <Form method="post" action="/Game/Setup">
            <div>
                <input type="hidden" name="multiplayer" defaultValue="false" />

                <div>
                    <label>Name</label>
                    <input type="text" name="player1Name" defaultValue="Local Player" />
                </div>

                <div>
                    <label>Difficulty</label>
                    <select name="difficulty">
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>

                <div>
                    <label>Planets</label>
                    <input
                        type="number"
                        name="planets"
                        max={32}
                        min={2}
                        defaultValue={8}
                    />
                </div>

                <div>
                    <MenuButton onClick={() => navigate("/")}>Cancel</MenuButton>
                    <MenuButton type="submit">Start</MenuButton>
                </div>
            </div>
        </Form>
    )
}
