const express = require('express'),
      User    = require('../models/user'),
      Post    = require('../models/post'),
      Bunny   = require('../models/bunny');

const router = express.Router({mergeParams: true});

// NEW - show the form for creating a new post
router.get('/new', isBunnyOwner, (req, res) => {
    const bunnyID = req.params.id;
    res.render('./posts/new', {bunnyID: bunnyID});
})

// CREATE - create a new post according to the sent form
router.post('/posts', isBunnyOwner, (req, res) => {
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
router.get('/:pid/edit', isBunnyOwner, (req, res) => {
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
router.put('/:pid', isBunnyOwner, (req, res) => {
    const bunnyID = req.params.id;
    const postID = req.params.pid;
    const post = req.body.post;
    // How about edit time?
    Post.findByIdAndUpdate(postID, post, (err, updatedPost) => {
        if (err) {
            console.log(`Error from Post.findByIdAndUpdate(): ${err}`);
            res.redirect(`/bunnies/${bunnyID}/posts/${postID}`);
        }   else {
            res.redirect(`/bunnies/${bunnyID}/posts/${postID}`);
        }
    })
})

// Destroy - delete the post
router.delete('/:pid', isBunnyOwner, (req, res) => {
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
                    res.redirect(`/bunnies/${bunnyID}`);
                })
                .catch((err) => console.log(`Error from Bunny.updateOne(): ${err}`));
        }
    })
})

module.exports = router;

// Middleware
function isBunnyOwner(req, res, next) {
    // Check if isLoggedIn
    if (req.isAuthenticated()) {
        const userID = req.user._id;
        const bunnyID = req.params.id;
        User.findById(userID, (err, foundUser) => {
            if (err) {
                console.log(`Error from User.findById(): ${err}`);
            }   else {
                if (foundUser.bunny.equals(bunnyID)) {
                    return next();
                }
                res.redirect(`/bunnies/${bunnyID}`); // Use flash message instead when modified
            }
        })
    }   else {
        res.redirect('/login');
    }
}