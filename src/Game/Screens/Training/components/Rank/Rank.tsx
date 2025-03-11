import Metadata from "Game/components/Metadata"
import { PlatoonState } from "Supremacy/entities"

const ranks = {
    0: "Cadet",
    12: "2nd Lieutenant",
    21: "Captain",
    30: "Major",
    42: "Lieutenant Colonel",
    51: "Colonel",
    60: "1 Star General",
    72: "2 Star General",
    81: "3 Star General",
    90: "4 Star General",
    100: "5 Star General",
}

const findRank = (value: number) => {
    const rankKeys = Object.keys(ranks)
        .map(Number)
        .sort((a, b) => b - a)

    const matchingKey = rankKeys.find((key) => value >= key) ?? 0

    return ranks[matchingKey as keyof typeof ranks]
}

export default function Rank({
    state,
    calibre,
}: {
    state: PlatoonState
    calibre: number
}) {
    const rank = state !== "standby" ? findRank(calibre) : ""

    return <Metadata label="Rank" alignment="right" value={rank} />
}
