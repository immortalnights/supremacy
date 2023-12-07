import React from "react"

export const useLocalStorageValue = (
    key: string,
    deserialize = false
): string | object | null => {
    let value: string | object | null = localStorage.getItem(key)

    if (value && deserialize) {
        value = JSON.parse(value)
    }

    return value
}

export const useLocalStorage = (
    key: string,
    defaultValue?: any,
    deserialize = false
): [string | object | null, (value: any) => void] => {
    const setLocalStorageValue = (value: any) => {
        const isString: boolean =
            typeof value === "string" || value instanceof String
        localStorage.setItem(key, isString ? value : JSON.stringify(value))
    }

    const set = React.useCallback(setLocalStorageValue, [])

    if (defaultValue) {
        setLocalStorageValue(defaultValue)
    }

    let currentValue: string | object | null = localStorage.getItem(key)

    if (currentValue && deserialize) {
        currentValue = JSON.parse(currentValue)
    }

    return [currentValue, set]
}
