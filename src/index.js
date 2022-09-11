const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const route = require('./routes')
const db = require('./config/db')
const dotenv = require('dotenv')

// env config
dotenv.config()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: true, 
    credentials: true
}))

// connect to db
db.connect()

// init route
route(app)
const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})