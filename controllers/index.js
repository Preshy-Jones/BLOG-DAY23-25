const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth')
const Post = require('./../models/post')


router.get('/getposts', async (req, res) => {
    const posts = await Post.find({}, { description: 0 });
    if (!posts) return res.status(400).send('no posts found');
    res.status(200).json(posts);

});


//welcome
router.get('/', (req, res) => res.render('welcome'));
//dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
    res.render('dashboard', {
        name: req.user.name
    }));



module.exports = router;