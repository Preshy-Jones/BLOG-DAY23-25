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

router.get('/edit/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('articles/edit', { post: post })
});

router.get('/:slug', async (req, res) => {
    //    res.send(req.params.id);
    const post = await Post.findOne({ slug: req.params.slug })
    if (post == null) res.redirect('/articles')
    res.render('articles/show', { post: post })
});

router.post('/', async (req, res, next) => {
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

router.put('/:id', (req, res) => {

});

router.delete('/:id', async (req, res) => {
    await Post.findByIdAndDelete(req.params.id)
    res.redirect('/articles')
});

function savePostAndRedirect(path) {
    return async (req, res) => {
        let post = req.post
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

router.get('/getposts', async (req, res) => {
    const posts = await Post.find({}, { description: 0 });
    if (!posts) return res.status(400).send('no posts found');
    res.status(200).json(posts);

});


module.exports = router