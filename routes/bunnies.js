const express     = require('express'),
      User        = require('../models/user'),
      Bunny       = require('../models/bunny'),
      middlewares = require('../middlewares'); // Will import index.js in middlewares folder automatically

const router = express.Router();

// INDEX - list all the bunnies
router.get('/', (req, res) => {
    Bunny.find({}, (err, foundBunnies) => {
        if (err) {
            console.log(`Error from Bunny.find(): ${err}`);
        }   else {
            if (req.isAuthenticated()) {
                const userID = req.user._id;
                User.findById(userID, (err, foundUser) => {
                    if (err) {
                        console.log(`Error from User.findById(): ${err}`);
                    }   else {
                        res.render('./bunnies/index', {bunnies: foundBunnies, user: foundUser});
                    }
                })
            }   else {
                res.render('./bunnies/index', {bunnies: foundBunnies});
            }
        }
    })
})

// NEW - show the form of creating the bunny's profile
router.get('/new', middlewares.isLoggedIn, (req, res) => {
    res.render('./bunnies/new');
})

// CREATE - create the bunny's profile according to the form
router.post('/', middlewares.isLoggedIn, (req, res) => {
    const userID   = req.user._id;
    const newBunny = req.body.bunny;
    newBunny.owner = userID;
    Bunny.create(newBunny, (err, createdBunny) => {
        if (err) {
            console.log(err);
            res.redirect('/bunnies/new');
        }   else {
            User.findById(userID, (err, foundUser) => {
                if (err) {
                    console.log(`Error from User.findById(): ${err}`);
                }   else {
                    foundUser.bunny = createdBunny;
                    foundUser.save();
                }
            })
            res.redirect('/bunnies');
        }
    })
})

// SHOW - show a specific bunny
router.get('/:id', (req, res) => {
    const bunnyID = req.params.id;
    Bunny.findById(bunnyID).populate('posts').exec((err, foundBunny) => {
        if (err) {
            console.log(`Error from Bunny.findById.populate.exec(): ${err}`);
        }   else {
            res.render('./bunnies/show', {bunny: foundBunny})
        }
    })
})

module.exports = router;