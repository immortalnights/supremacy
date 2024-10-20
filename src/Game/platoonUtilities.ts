import { Platoon } from "./entities"

export const getPlatoonName = (() => {
    const suffixes = new Map([
        ["one", "st"],
        ["two", "nd"],
        ["few", "rd"],
        ["other", "th"],
    ])

    const pr = new Intl.PluralRules("en-US", { type: "ordinal" })
    return (platoon?: Platoon) => {
        const value = (platoon?.index ?? 0) + 1
        const rule = pr.select(value)
        const suffix = suffixes.get(rule)
        return platoon ? `${value}${suffix}` : undefined
    }
})()
