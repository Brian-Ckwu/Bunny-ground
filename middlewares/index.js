const User    = require('../models/user'),
      Comment = require('../models/comment');

const middlewares= {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error', 'You have to login first!');
        res.redirect('/login');
    },
    
    isBunnyOwner(req, res, next) {
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
                    req.flash('error', 'You are not the owner of the bunny!');
                    res.redirect(`/bunnies/${bunnyID}`);
                }
            })
        }   else {
            req.flash('error', 'You have to login first!');
            res.redirect('/login');
        }
    },

    isCommentAuthor(req, res, next) {
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
                    req.flash('error', 'You are not the author of the comment!');
                    res.redirect(`/bunnies/${bunnyID}/posts/${postID}`); // Use flash message instead when modified
                }
            })
        }   else {
            req.flash('error', 'You have to login first!');
            res.redirect('/login');
        }
    }

}

module.exports = middlewares