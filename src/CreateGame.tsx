import { Form, useNavigate } from "react-router-dom"

// TODO Two player cards, on CPU or Remote player. No "lobby", etc.

export default function CreateGame() {
    const navigate = useNavigate()

    return (
        <Form method="post" action="/Game/Setup">
            <div>
                <input type="hidden" name="players" value={1} />
                <select name="difficulty">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="impossible">Impossible</option>
                </select>
                <div>TODO</div>
                <button type="button" onClick={() => navigate("/")}>
                    Cancel
                </button>
                <button type="submit">Start</button>
            </div>
        </Form>
    )
}
