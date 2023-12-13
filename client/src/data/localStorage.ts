import React from "react"

export const useLocalStorageValue = (
    key: string,
    deserialize = false
): string | object | null => {
    let value: string | object | null = localStorage.getItem(key)

    if (value && deserialize) {
        value = JSON.parse(value) as object
    }

    return value
}

export const useLocalStorage = (
    key: string,
    defaultValue?: unknown,
    deserialize = false
): [string | object | null, (value: unknown) => void] => {
    const setLocalStorageValue = (value: unknown) => {
        localStorage.setItem(
            key,
            value instanceof String ? (value as string) : JSON.stringify(value)
        )
    }

    const set = React.useCallback(setLocalStorageValue, [key])

    if (defaultValue) {
        setLocalStorageValue(defaultValue)
    }

    let currentValue: string | object | null = localStorage.getItem(key)

    if (currentValue && deserialize) {
        currentValue = JSON.parse(currentValue) as object
    }

    return [currentValue, set]
}
