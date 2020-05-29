const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth')
const Post = require('./../models/post')


router.get('/getposts', ensureAuthenticated, async (req, res) => {
    const posts = await Post.find({}, { description: 0 });
    if (!posts) return res.status(400).send('no posts found');
    res.status(200).json(posts);
    //    res.send(req.user);
});

router.get('/getpost/:id', async (req, res) => {
    const post = await Post.find({ _id: req.params.id });
    if (!post) return res.status(400).send('no posts found');
    res.status(200).json(post);
    //    res.send(req.user);
});


//welcome
router.get('/', async (req, res) => {
    const posts = await Post.find().sort({
        createdAt: 'desc'
    })
    res.render('articles/blog', { posts: posts });

    //res.render('articles/blog')
});
//dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    const tempPosts = await Post.find().sort({
        createdAt: 'desc'
    })
    const posts = tempPosts.filter(post => post.userId === req.user._id.toString())

    res.render('dashboard', {
        name: req.user.name,
        posts: posts
    })
});

router.delete('/dashboard/:id', async (req, res) => {
    await Post.findByIdAndDelete(req.params.id)
    res.redirect('/dashboard')
});


module.exports = router;