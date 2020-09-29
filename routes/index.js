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
            console.log(err);
            res.redirect('/register');
        }   else {
            // console.log(registeredUser);
            res.redirect('/bunnies');
        }
    })
})

// Login route
router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/bunnies',
    failureRedirect: '/login'
}))

// Logout route
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/bunnies');
})

module.exports = router;