const express  = require('express'),
      passport = require('passport'),
      User     = require('../models/user');

const router = express.Router();

// Landing page
router.get('/', (req, res) => {
    res.render('landing');
})

// Registration route
router.get('/register', (req, res) => {
    res.render('register');
})

router.post('/register', (req, res) => {
    const username = req.body.user.username;
    const password = req.body.user.password;
    User.register({username: username}, password, (err, registeredUser) => {
        if (err) {
            req.flash('error', err.message);
            res.redirect('/register');
        }   else {
            req.flash('success', 'You have signed up successfully!');
            res.redirect('/bunnies');
        }
    })
})

// Login route
router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('error', 'Please enter the correct username and password')
            return res.redirect('/login');
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            req.flash('success', 'You have logged in successfully!')
            return res.redirect(req.prevPrevPath);
        });
    })(req, res, next);
});

// Logout route
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'You have logged out successfully!');
    res.redirect(req.prevPath);
})

module.exports = router;