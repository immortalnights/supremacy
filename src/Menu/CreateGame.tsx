import { Form, useNavigate } from "react-router-dom"
import Button from "components/Button"

// TODO Two player cards, on CPU or Remote player. No "lobby", etc.

export default function CreateGame() {
    const navigate = useNavigate()

    return (
        <Form method="post" action="/Game/Setup">
            <div>
                <input type="hidden" name="multiplayer" defaultValue="false" />

                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="player1Name"
                        defaultValue="Local Player"
                    />
                </div>

                <div>
                    <label>Difficulty</label>
                    <select name="difficulty">
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                        <option value="impossible">Impossible</option>
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
                    <Button type="button" onClick={() => navigate("/")}>
                        Cancel
                    </Button>
                    <button type="submit">Start</button>
                </div>
            </div>
        </Form>
    )
}
