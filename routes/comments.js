const express = require('express'),
      Post    = require('../models/post'),
      Comment = require('../models/comment');

const router = express.Router({mergeParams: true});

// NEW - show the form for creating a new comment
router.get('/new', isLoggedIn, (req, res) => {
    const bunnyID = req.params.id;
    const postID = req.params.pid;
    res.render('./comments/new', {bunnyID: bunnyID, postID: postID});
})

// CREATE - create a new comment according to the submitted form
router.post('/', isLoggedIn, (req, res) => {
    const bunnyID = req.params.id;
    const postID = req.params.pid;
    const comment = req.body.comment;
    comment.author = req.user._id;
    Comment.create(comment, (err, createdComment) => {
        if (err) {
            console.log(`Error from Comment.create(): ${err}`);
            res.redirect(`/bunnies/${bunnyID}/posts/${postID}`);
        }   else {
            // Associate the post with the comment
            Post.findById(postID, (err, foundPost) => {
                if (err) {
                    console.log(`Error from Post.findById(): ${err}`);
                }   else {
                    foundPost.comments.push(createdComment);
                    foundPost.save()
                        .catch((err) => console.log(err));
                }
            })
            res.redirect(`/bunnies/${bunnyID}/posts/${postID}`);
        }
    })
})

module.exports = router;

// Middlewares (refactoring: move the middlewares to a separate file)
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}