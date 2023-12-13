import Recoil from "recoil"
import { IEspionageReport } from "@server/simulation/types"

export const EspionageReport = Recoil.atom<IEspionageReport | undefined>({
    key: "EspionageReport",
    default: undefined,
})
