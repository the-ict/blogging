const router = require("express").Router()
const bcrypt = require("bcrypt")
const User = require("../models/User")

// register 
router.post("/register", async (req, res) => {
    try {
        const { password } = req.body
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })
        const savedUser = await newUser.save()
        if (savedUser) return res.status(200).json(savedUser)
        res.status(300).json({ message: "malumotlarni saqlab bo'lmadi !" })
    } catch (error) {
        res.status(500).json(error)
    }
})

// login 
router.post("/login", async (req, res) => {
    try {
        const { password, username } = req.body

        const oneUser = await User.findOne({ username })
        if (oneUser) return res.status(404).json({ message: "xech qanday foydalanuvchi topilmadi !" })
        const validatedPassword = bcrypt.compareSync(password, oneUser.password)
        if (validatedPassword) return res.status(400).json({ message: "malumotlar no'tog'ri !" })

        res.status(200).json(oneUser);
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router