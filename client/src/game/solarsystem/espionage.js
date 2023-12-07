import React from "react"
import {} from "recoil"
import Button from "../../components/button"
// import './styles.css'

const Espionage = (props) => {
    return (
        <div className="espionage-container">
            <div style={{ textAlign: "center" }}>Spy Information</div>
            <ol className="espionage-list">
                <li>
                    <div>Resources</div>
                    <div>1000 Credits</div>
                </li>
                <li>
                    <div>Population</div>
                    <div>1520 Credits</div>
                </li>
                <li>
                    <div>War Status</div>
                    <div>2200 Credits</div>
                </li>
                <li>
                    <div>Everything</div>
                    <div>4720 Credits</div>
                </li>
            </ol>
            <div style={{ textAlign: "center" }}>
                <Button onClick={props.onCancel}>Cancel</Button>
            </div>
        </div>
    )
}

export default Espionage
