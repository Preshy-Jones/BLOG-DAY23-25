const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth')
const Post = require('./../models/post')
//const methodOverride = require

router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('articles/new', { post: new Post() })
    //res.send('in articles')

});

router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    const post = await Post.findById(req.params.id)
    //    res.send(post.userId === req.user._id.toString())
    //res.send(post)
    if (post.userId !== req.user._id.toString()) {
        res.send('not allowed')
    } else {
        res.render('articles/edit', { post: post })
    }

});

router.get('/:slug', ensureAuthenticated, async (req, res) => {
    //    res.send(req.params.id);

    const post = await Post.findOne({ slug: req.params.slug })
    if (post == null) res.redirect('/articles')
    res.render('articles/show', { post: post })
    //    res.send(post.userId === req.user._id.toString())

    // if (post.userId !== req.user._id.toString()) {
    //     res.send('not allowed')
    // } else {
    //     res.render('articles/show', { post: post })
    // }
});

router.post('/', ensureAuthenticated, async (req, res, next) => {
    req.post = new Post()
    next()
}, savePostAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
    req.post = await Post.findById(req.params.id)
    next()
}, savePostAndRedirect('edit'))



router.get('/', async (req, res) => {
    const posts = await Post.find().sort({
        createdAt: 'desc'
    })
    res.render('articles/blog', { posts: posts });

});

router.delete('/:id', ensureAuthenticated, async (req, res) => {
    const post = await Post.findById(req.params.id)
    //    res.send(post.userId === req.user._id.toString())
    //res.send(post)
    if (post.userId !== req.user._id.toString()) {
        res.send('not allowed')
    } else {
        await Post.findByIdAndDelete(req.params.id)
        res.redirect('/articles')
    }



});

function savePostAndRedirect(path) {
    return async (req, res) => {
        let post = req.post
        post.userId = req.user._id
        post.title = req.body.title
        post.description = req.body.description
        post.markdown = req.body.markdown
        try {
            post = await post.save()
            res.redirect(`/articles/${post.slug}`)
        } catch (e) {
            res.render(`articles/${path}`, { post: post })
        }
    }
}


function setUser(req, res, next) {
    const userId = req.body.userId
    if (userId) {
        req.user = users.find(user => user.id === userId)
    }
    next()
}


module.exports = router