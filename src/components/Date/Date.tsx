import Metadata, { type MetadataAlignment } from "../Metadata"

export default function Date({
    alignment = "left",
}: {
    alignment?: MetadataAlignment
}) {
    return <Metadata label="Date" value="01/2001" alignment={alignment} />
}
