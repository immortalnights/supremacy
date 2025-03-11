import { PlatoonState } from "Supremacy/entities"

import training_calibre from "/images/training_calibre.png"
import training_fast from "/images/training_fast.gif"
import training_medium from "/images/training_medium.gif"
import training_slow from "/images/training_slow.gif"

const calibre = {
    paused: training_calibre,
    fast: training_fast,
    medium: training_medium,
    slow: training_slow,
}

export default function Calibre({
    state,
    calibre: value,
}: {
    state: PlatoonState
    calibre: number
}) {
    let src
    if (state === "standby") {
        src = calibre.paused
    } else if (value < 33) {
        src = calibre.slow
    } else if (value < 66) {
        src = calibre.medium
    } else {
        src = calibre.fast
    }
    return <img src={src} />
}
