import Metadata from "../Metadata"

export default function ShipHeading() {
    return (
        <div>
            Heading
            <div>
                <Metadata label="Ship" />
                <Metadata label="From" />
                <Metadata label="To" />
                <Metadata label="ETA" />
                <Metadata label="Fuel" />
            </div>
        </div>
    )
}
