const router = require("express").Router()
const User = require("../models/User")
const Post = require("../models/Post")
const bcrypt = require("bcrypt")

// update
router.put("/:id", async (req, res) => {
    if (req.body.user_id === req.params.id) {
        if (req.body.password) {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(req.body.password, salt)
            req.body.password = hash
        }
        const updated_user = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true })
        !updated_user && (res.status(400).json({ message: "user malumotlari yangilanmadi !" }))
        res.status(201).json(updated_user)
    } else {
        res.status(400).json({ message: "Siz faqat o'zingizni hisobingizni yangilay olasiz !" })
    }
})
// delete
router.delete("/:id", async (req, res) => {
    if (req.body.user_id === req.params.id) {
        await User.findByIdAndDelete(req.params.id)
        await Post.deleteMany({ username: req.body.username })
        res.status(200).json({ message: "user o'chirib tashlandi !" })
    } else {
        res.status(400).json({ message: "Siz faqat o'zingizni hisobingizni o'chira olasiz !" })
    }
})
// get one
router.get("/:id", async (req, res) => {
    try {
        const oneUser = await User.findById(req.params.id)
        res.status(200).json(oneUser)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router