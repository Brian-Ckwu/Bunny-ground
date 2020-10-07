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

// EDIT - show the form for editing a specific comment
router.get('/:cid/edit', isCommentAuthor, (req, res) => {
    const bunnyID = req.params.id;
    const postID = req.params.pid;
    const commentID = req.params.cid;
    Comment.findById(commentID, (err, foundComment) => {
        if (err) {
            console.log(`Error from Comment.findById(): ${err}`);
            res.redirect(`/bunnies/${bunnyID}/posts/${postID}`);
        }   else {
            res.render('./comments/edit', {bunnyID: bunnyID, postID: postID, comment: foundComment});
        }
    })
})

// UPDATE - update a specific comment according to the edit form
router.put('/:cid', isCommentAuthor, (req, res) => {
    const bunnyID = req.params.id;
    const postID = req.params.pid;
    const commentID = req.params.cid;
    const comment = req.body.comment;
    Comment.findByIdAndUpdate(commentID, comment, (err, updatedComment) => {
        if (err) {
            console.log(`Error from Comment.findByIdAndUpdate(): ${err}`);
            res.redirect(`/bunnies/${bunnyID}/posts/${postID}`);
        }   else {
            res.redirect(`/bunnies/${bunnyID}/posts/${postID}`);
        }
    })
})

// DESTROY - delete a specific post
router.delete('/:cid', isCommentAuthor, (req, res) => {
    const bunnyID = req.params.id;
    const postID = req.params.pid;
    const commentID = req.params.cid;
    Comment.findByIdAndDelete(commentID, (err, deletedComment) => {
        if (err) {
            console.log(`Error from Comment.findByIdAndDelete(): ${err}`);
            res.redirect(`/bunnies/${bunnyID}/posts/${postID}`);
        }   else {
            // Also need to remove commentID from the post
            Post.updateOne({_id: postID}, {$pull: {comments: commentID}})
                .then(() => {
                    res.redirect(`/bunnies/${bunnyID}/posts/${postID}`);
                })
                .catch((err) => {
                    console.log(`Error from Post.updateOne(): ${err}`);
                    res.redirect(`/bunnies/${bunnyID}/posts/${postID}`);
                })
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

function isCommentAuthor(req, res, next) {
    // Check if isLoggedIn
    if (req.isAuthenticated()) {
        const userID = req.user._id;
        const postID = req.params.pid;
        const commentID = req.params.cid;
        Comment.findById(commentID, (err, foundComment) => {
            if (err) {
                console.log(`Error from User.findById(): ${err}`);
            }   else {
                if (foundComment.author.equals(userID)) {
                    return next();
                }
                res.redirect(`/bunnies/${bunnyID}/posts/${postID}`); // Use flash message instead when modified
            }
        })
    }   else {
        res.redirect('/login');
    }
}