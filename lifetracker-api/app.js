const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const {BadRequestError, NotFoundError} = require("./utils/errors")
const authRoutes = require("./routes/auth")
const security = require("./middleware/security")
const app = express()


app.use(cors())
app.use(express.json())
app.use(morgan("tiny"))

app.use(security.extractUserFromJwt)

app.use("/auth", authRoutes)

app.get("/", (req, res, next) => {
    res.status(200).json()
})

app.use((req, res, next) => {
    return next(new NotFoundError())
})

app.use((err, req, res, next) => {
    const status = err.status || 500
    const message = err.message

    return res.status(status).json({
        error: {message, status}
    })
})

module.exports = {
    app
}