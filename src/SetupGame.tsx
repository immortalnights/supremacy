import { Form } from "react-router-dom"

export default function SetupGame() {
    return (
        <div>
            <Form method="post" action="/Game">
                <input type="hidden" name="players" value={1} />
                <select name="difficulty">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="impossible">Impossible</option>
                </select>
                <div>TODO</div>
                <button type="submit">Start</button>
            </Form>
        </div>
    )
}
