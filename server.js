const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const multer = require("multer")
const cors = require("cors")


const app = express()
dotenv.config()

app.use(express.json())
app.use(cors())

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images")
    },
    filename: (req, file, cb) => {
        console.log(Date.now() + file.originalname)
        cb(null, `${Date.now() + file.originalname}`)
    }
})

const upload = multer({ storage })

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Mongo dbga ulandim !")
}).catch(err => console.log("mongo error", err))


app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json({ message: "file yuklandi !" })
})
app.use("/api/auth", require("./routers/auth"))
app.use("/api/user", require("./routers/user"))
app.use("/api/post", require("./routers/post"))
app.use("/api/categories", require("./routers/categories"));


app.listen(process.env.PORT || 3000, () => {
    console.log(`server is running ! on port ${process.env.PORT || 3000}`)
})