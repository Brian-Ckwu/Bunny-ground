const express = require('express'),
      User    = require('../models/user'),
      Post    = require('../models/post'),
      Bunny   = require('../models/bunny');

const router = express.Router();

// NEW - show the form for creating a new post
router.get('/bunnies/:id/posts/new', isBunnyOwner, (req, res) => {
    const bunnyID = req.params.id;
    res.render('./posts/new', {bunnyID: bunnyID});
})

// CREATE - create a new post according to the sent form
router.post('/bunnies/:id/posts', isBunnyOwner, (req, res) => {
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
router.get('/bunnies/:id/posts/:pid', (req, res) => {
    // 
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