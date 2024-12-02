const router = require("express").Router()
const Post = require("../models/Post")

// create
router.post("/", async (req, res) => {
    try {
        const newPost = new Post(req.body)
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (error) {
        res.status(500).json(error)
    }
})
// update
router.put("/:id", async (req, res) => {
    try {
        const onePost = await Post.findById(req.params.id)
        if (req.body.username === onePost.username) {
            const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true })
            res.status(200).json(updatedPost)
        } else {
            res.status(300).json({ message: "Siz faqat o'zingizni postingizni o'chira olasiz !" })
        }
    } catch (error) {
        res.status(500).json(error)
    }
})
// delete
router.delete("/:id", async (req, res) => {
    try {
        const onePost = await Post.findById(req.params.id)
        if (req.body.username === onePost.username) {
            await Post.findByIdAndDelete(req.params.id)
        } else {
            res.status(300).json({ message: "Siz faqat o'zingizni postingizni o'chirib tashlay olasiz !" })
        }
    } catch (error) {
        res.status(500).json(error)
    }
})
// get one
router.get("/:id", async (req, res) => {
    try {
        const onePost = await Post.findById(req.params.id)
        res.status(200).json(onePost)
    } catch (error) {
        res.status(500).json(error)
    }
})
// get all
router.get('/', async (req, res) => {
    const username = req.query.user
    const category = req.query.category
    try {
        let posts
        if (username) {
            posts = await Post.find({ username })
        } else if (category) {
            posts = await Post.find({
                categories: {
                    $in: [category]
                }
            })
        }
        else {
            posts = await Post.find()
        }
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router