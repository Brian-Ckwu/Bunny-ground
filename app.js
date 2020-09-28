const express               = require('express'),
      bodyParser            = require('body-parser'),
      mongoose              = require('mongoose'),
      expressSession        = require('express-session'),
      passport              = require('passport'),
      localStrategy         = require('passport-local'),
      User                  = require('./models/user'),
      Bunny                 = require('./models/bunny'),
      seedDB                = require('./seedDB');

const app = express();

// Seed the database
seedDB();

// Set the ejs file as the default view engine
app.set('view engine', 'ejs');
// Use the middlewares
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
// Passport configuration
app.use(expressSession({
    secret: 'Brian Wu',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Pass these local variables to every ejs file
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

// Landing page
app.get('/', (req, res) => {
    res.render('landing');
})

// INDEX - list all the bunnies
app.get('/bunnies', (req, res) => {
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
app.get('/bunnies/new', isLoggedIn, (req, res) => {
    res.render('./bunnies/new');
})

// CREATE - create the bunny's profile according to the form
app.post('/bunnies', isLoggedIn, (req, res) => {
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
app.get('/bunnies/:id', (req, res) => {
    const bunnyID = req.params.id;
    Bunny.findById(bunnyID, (err, foundBunny) => {
        res.render('./bunnies/show', {bunny: foundBunny}); 
    })
})

// Registration route
app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', (req, res) => {
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
app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/bunnies',
    failureRedirect: '/login'
}))

// Listen to the port 7777
app.listen(7777, () => {
    console.log('The BunnyGround server is now running...')
})

// Middlewares
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}