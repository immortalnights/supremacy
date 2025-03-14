export function throwError(...args: ConstructorParameters<typeof Error>): never {
    throw new Error(...args)
}

export const clone = <TResource extends { id: string }, TArray extends { id: string }>(
    resource: TResource,
    array: TArray[],
): [TResource, TArray[]] => {
    const index = array.findIndex((item) => item.id === resource.id)

    if (index === -1) {
        console.error(`Failed to find ${resource.id} in array`, array)
        throw new Error(`Failed to find ${resource.id} in array`)
    }

    // Copy array
    const clonedArray = [...array]

    // Clone the resource
    const clonedResource = { ...array[index] }

    // Apply clone to array
    clonedArray[index] = clonedResource

    return [clonedResource as unknown as TResource, clonedArray] as const
}

export const random = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min)
}

export const randomChoice = <T>(options: T[]) => {
    return options[random(0, options.length - 1)]
}

export const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value))
}

export const nextFreeIndex = <T extends { location: { index: number } }>(
    items: T[],
    maxIndex: number,
): number => {
    let availableIndex
    for (let index = 0; index < maxIndex; index++) {
        const item = items.find((item) => item.location.index === index)
        if (!item) {
            availableIndex = index
            break
        }
    }

    // default to max, should never happen but should just result in
    // a display issue if it does.
    if (availableIndex === undefined) {
        availableIndex = maxIndex
    }

    return availableIndex
}
