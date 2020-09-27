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
// Use
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
            res.render('./bunnies/index', {bunnies: foundBunnies});
        }
    })
})

// NEW - show the form of creating the bunny's profile
app.get('/bunnies/new', (req, res) => {
    res.render('./bunnies/new');
})

// CREATE - create the bunny's profile according to the form
app.post('/bunnies', (req, res) => {
    const newBunny = req.body.bunny;
    Bunny.create(newBunny, (err, createdBunny) => {
        if (err) {
            console.log(err);
            res.redirect('/bunnies/new');
        }   else {
            console.log(createdBunny);
            res.redirect('/bunnies');
        }
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
            console.log(registeredUser);
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

app.listen(7777, () => {
    console.log('The BunnyGround server is now running...')
})