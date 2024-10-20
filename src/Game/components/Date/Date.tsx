import Metadata, { type MetadataAlignment } from "Game/components/Metadata"
import { useDate } from "./useDate"

export default function Date({
    alignment = "left",
}: {
    alignment?: MetadataAlignment
}) {
    const date = useDate()

    return <Metadata label="Date" value={date} alignment={alignment} />
}
