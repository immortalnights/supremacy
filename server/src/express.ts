import express from "express"

export const app = express()

app.use(express.json())

const router = express.Router()

router.use((req, res, next) => {
    console.log(`Time: ${Date.now()}`)
    next()
})

router.get("/", (req, res) => {
    res.json({
        ok: false,
    })
})

app.use(router)
