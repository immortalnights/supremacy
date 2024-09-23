import { useAtomValue } from "jotai"
import Metadata, { type MetadataAlignment } from "../Metadata"
import { dateAtom } from "../../Game/store"

const days_per_month = 60

export default function Date({
    alignment = "left",
}: {
    alignment?: MetadataAlignment
}) {
    const date = useAtomValue(dateAtom)

    const month = 1 + (date % days_per_month)
    const year = 2000 + Math.floor(date / days_per_month)

    return (
        <Metadata
            label="Date"
            value={`${month}/${year}`}
            alignment={alignment}
        />
    )
}
