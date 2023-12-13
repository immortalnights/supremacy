function wrapPromise(promise: Promise<unknown>) {
    let status = "pending"
    let response: unknown

    const suspender = promise.then(
        (res: unknown) => {
            status = "success"
            response = res
        },
        (err: unknown) => {
            status = "error"
            response = err
        }
    )

    const read = () => {
        switch (status) {
            case "pending":
                throw suspender
            case "error":
                throw response
            default:
                return response
        }
    }

    return { read }
}

export default wrapPromise
