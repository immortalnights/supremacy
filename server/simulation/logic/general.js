export const random = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min
}

export const clamp = (val, min, max) => {
    return Math.min(Math.max(val, min), max)
}

export const nextIndex = (index, length) => {
    let next = index + 1
    if (next > length - 1) {
        next = 0
    }

    return next
}

export const prevIndex = (index, length) => {
    let prev = index - 1
    if (prev < 0) {
        prev = length - 1
    }

    return prev
}

export const calculateTransfer = (source, target, maximum, requested) => {
    let transfer
    if (requested > 0) {
        transfer = Math.min(maximum - target, source, requested)
    } else {
        transfer = -Math.min(target, Math.abs(requested))
    }

    return transfer
}
