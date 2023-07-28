const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
var cors = require("cors")


const app = express()
dotenv.config()

//cors
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const dbURL = process.env.DBCONNECTION
mongoose.set("strictQuery", false)
const db = "UserAuthRestaurants"

mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        app.listen(3000)

        console.log("Listening to port 3000 and database is connected!")
    })
    .catch((err) => console.log(err))


app.use("/api/auth", require("./routes/user"))
app.use("/api/restaurants", require("./routes/restaurants"))
