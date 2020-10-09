const express     = require('express'),
      User        = require('../models/user'),
      Post        = require('../models/post'),
      Bunny       = require('../models/bunny'),
      middlewares = require('../middlewares');

const router = express.Router({mergeParams: true});

// NEW - show the form for creating a new post
router.get('/new', middlewares.isBunnyOwner, (req, res) => {
    const bunnyID = req.params.id;
    res.render('./posts/new', {bunnyID: bunnyID});
})

// CREATE - create a new post according to the sent form
router.post('/', middlewares.isBunnyOwner, (req, res) => {
    let newPost = req.body.post;
    newPost.author = req.user._id;
    Post.create(newPost, (err, createdPost) => {
        if (err) {
            console.log(`Error from Post.create(): ${err}`);
        }   else {
            const bunnyID = req.params.id;
            // Associate the post with the bunny
            Bunny.findById(bunnyID, (err, foundBunny) => {
                if (err) {
                    console.log(`Error from Bunny.findById(): ${err}`);
                }   else {
                    foundBunny.posts.push(createdPost);
                    foundBunny.save();
                }
            })
            req.flash('success', 'You have added a post successfully!');
            res.redirect(`/bunnies/${bunnyID}`);
            // res.redirect(`/bunnies/${bunnyID}/posts/${createdPost._id}`);
        }
    })
})

// SHOW - show a specific post
router.get('/:pid', (req, res) => {
    const bunnyID = req.params.id;
    const postID = req.params.pid;
    Post.findById(postID).populate({path: 'comments', populate: 'author'}).exec((err, foundPost) => { // How to populate the comment?
        if (err) {
            console.log(`Error from Post.findById(): ${err}`);
            res.redirect(`/bunnies/${bunnyID}`);
        }   else {
            res.render('./posts/show', {post: foundPost, bunnyID: bunnyID});
        }
    })
})

// EDIT - show the edit form for the post
router.get('/:pid/edit', middlewares.isBunnyOwner, (req, res) => {
    const bunnyID = req.params.id;
    const postID = req.params.pid;
    Post.findById(postID, (err, foundPost) => {
        if (err) {
            console.log(`Error from Post.findById(): ${err}`);
            res.redirect(`/bunnies/${bunnyID}/posts/${postID}`);
        }   else {
            res.render('./posts/edit', {post: foundPost, bunnyID: bunnyID});
        }
    })
})

// UPDATE - update the post according to the edit form
router.put('/:pid', middlewares.isBunnyOwner, (req, res) => {
    const bunnyID = req.params.id;
    const postID = req.params.pid;
    const post = req.body.post;
    // How about edit time?
    Post.findByIdAndUpdate(postID, post, (err, updatedPost) => {
        if (err) {
            console.log(`Error from Post.findByIdAndUpdate(): ${err}`);
            res.redirect(`/bunnies/${bunnyID}/posts/${postID}`);
        }   else {
            req.flash('success', 'You have editted the post successfully!');
            res.redirect(`/bunnies/${bunnyID}/posts/${postID}`);
        }
    })
})

// Destroy - delete the post
router.delete('/:pid', middlewares.isBunnyOwner, (req, res) => {
    const bunnyID = req.params.id;
    const postID = req.params.pid;
    Post.findByIdAndDelete(postID, (err, deletedPost) => {
        if (err) {
            console.log(`Error from Post.findByIdAndDelete(): ${err}`);
            res.redirect(`/bunnies/${bunnyID}/posts/${postID}`);
        }   else {
            // Also need to remove post ObjectID from the associated bunny
            Bunny.updateOne({_id: bunnyID}, {$pull: {posts: postID}})
                .then(() => {
                    req.flash('success', 'You have deleted the post successfully!');
                    res.redirect(`/bunnies/${bunnyID}`);
                })
                .catch((err) => console.log(`Error from Bunny.updateOne(): ${err}`));
        }
    })
})

module.exports = router;