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
        res.render('articles/notallowed')
        //res.send('not allowed')
    } else {
        res.render('articles/edit', { post: post })
    }

});




router.get('/:id', async (req, res) => {
    //    res.send(req.params.id);

    const post = await Post.findById(req.params.id)
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
    // res.send(post.userId)
    //    res.send(post.userId === req.user._id.toString())
    // res.send(post)
    if (post.userId !== req.user._id.toString()) {
        res.render('articles/notallowed')
        //res.send('not allowed')
    } else {
        await Post.findByIdAndDelete(req.params.id)
        res.redirect('/articles')
    }
});


router.put('/likes/:id', ensureAuthenticated, async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (post.likedBy.includes(req.user._id) === true) {
        post.likes = post.likes - 1
        post.likedBy.splice((post.likedBy.indexOf(req.user._id)), 1)
        await Post.findByIdAndUpdate({ _id: post._id }, { likes: post.likes, likedBy: post.likedBy })
        res.redirect('/articles')
    } else if (post.likedBy.includes(req.user._id) === false) {
        post.likes = post.likes + 1
        post.likedBy.push((req.user._id))
        //        console.log(post.likedBy);

        await Post.findByIdAndUpdate({ _id: post._id }, { likes: post.likes, likedBy: post.likedBy }, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        })
        res.redirect('/articles')
    }
    // if(req.user._id.toString() ===post.userId)
    //res.send(post)

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
            res.redirect(`/articles/${post.id}`)
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