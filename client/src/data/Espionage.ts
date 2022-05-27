import Recoil from "recoil";
import { IEspionageReport } from "../simulation/types.d";

export const EspionageReport = Recoil.atom<IEspionageReport | undefined>({
  key: "EspionageReport",
  default: undefined,
})