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
            const bunnies = randomizeArray(foundBunnies);
            if (req.isAuthenticated()) {
                const userID = req.user._id;
                User.findById(userID, (err, foundUser) => {
                    if (err) {
                        console.log(`Error from User.findById(): ${err}`);
                    }   else {
                        res.render('./bunnies/index', {bunnies: bunnies, user: foundUser});
                    }
                })
            }   else {
                res.render('./bunnies/index', {bunnies: bunnies});
            }
        }
    })
})

// NEW - show the form of creating the bunny's profile
router.get('/new', middlewares.isLoggedIn, (req, res) => {
    if (req.user.bunny) {
        req.flash('error', 'Don\'t be so greedy. You already have a bunny!');
        res.redirect('/bunnies');
    }   else {
        res.render('./bunnies/new');
    }
})

// CREATE - create the bunny's profile according to the form
router.post('/', middlewares.isLoggedIn, (req, res) => {
    const userID   = req.user._id;
    const newBunny = req.body.bunny;
    newBunny.owner = userID;
    // New codes
    User.findById(userID, (err, foundUser) => {
        if (err) {
            console.log(`Error from User.findById(): ${err.message}`);
            res.redirect('/bunnies');
        }   else {
            if (foundUser.bunny) {
                req.flash('error', 'Don\'t be so greedy. You already have a bunny!');
                res.redirect('/bunnies');
            }   else {
                Bunny.create(newBunny, (err, createdBunny) => {
                    if (err) {
                        console.log(`Error from Bunny.create(): ${err.message}`);
                        res.redirect('/bunnies');
                    }   else {
                        foundUser.bunny = createdBunny;
                        foundUser.save()
                            .then(() => {
                                req.flash('success', 'You have added your bunny successfully!');
                                res.redirect('/bunnies');
                            })
                    }
                })
            }
        }
    })
})

// FAVORITES route (this route must be placed before the SHOW route)
router.get('/favorites', middlewares.isLoggedIn, (req, res) => {
    const userID = req.user._id;
    User.findById(userID).populate('favorites').exec((err, foundUser) => {
        if (err) {
            console.log(`Error from User.findById(): ${err.message}`);
            res.redirect('/bunnies');
        }   else {
            res.render('./bunnies/favorites', {user: foundUser});
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

// EDIT - show the edit form
router.get('/:id/edit', (req, res) => {
    const bunnyID = req.params.id;
    Bunny.findById(bunnyID, (err, foundBunny) => {
        if (err) {
            console.log(`Error from Bunny.findById(): ${err.message}`);
            res.redirect(`/bunnies/${bunnyID}`);
        }   else {
            res.render('./bunnies/edit', {bunny: foundBunny});
        }
    })
})

// UPDATE - update the bunnies according to the submitted form
router.put('/:id', (req, res) => {
    const bunnyID = req.params.id;
    const bunny = req.body.bunny;
    Bunny.findByIdAndUpdate(bunnyID, bunny, (err, updatedBunny) => {
        if (err) {
            console.log(`Error from Bunny.findByIdAndUpdate(): ${err.message}`);
            res.redirect(`/bunnies/${bunnyID}`);
        }   else {
            res.redirect(`/bunnies/${bunnyID}`);
        }
    })
})

// Add to favorites
router.post('/favorites/:id/add', middlewares.isLoggedIn, (req, res) => {
    const userID = req.user._id;
    const bunnyID = req.params.id;
    // Use updateOne instead of findById then push/save
    User.updateOne({_id: userID}, {$push: {favorites: bunnyID}})
        .then(() => {
            // console.log(`Add ${bunnyID} to favorites`);
            res.status(204).send();
            // Window message: successfully added to favorites
        })
        .catch((err) => {
            console.log(`Error from User.updateOne(): ${err.message}`);
            req.flash('error', 'Fail to add to favorites. There might be a problem.');
            res.redirect('/bunnies');
        })
})

// Remove from favorites
router.post('/favorites/:id/remove', middlewares.isLoggedIn, (req, res) => {
    const userID = req.user._id;
    const bunnyID = req.params.id;
    User.updateOne({_id: userID}, {$pull: {favorites: bunnyID}})
        .then(() => {
            // console.log(`Remove ${bunnyID} from favorites`);
            res.status(204).send();
            // Window message: successfully removed from favorites
        })
        .catch((err) => {
            console.log(`Error from User.updateOne(): ${err.message}`);
            req.flash('error', 'Fail to remove from favorites. There might be a problem.');
            res.redirect('/bunnies');
        })
})

module.exports = router;

function randomizeArray(arr) {
    const newArr = [];
    while (arr.length > 0) {
        const removeIndex = Math.floor(arr.length * Math.random()); 
        const e = arr.splice(removeIndex, 1)[0];
        newArr.push(e);
    }
    return newArr;
}