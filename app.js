const express               = require('express'),
      bodyParser            = require('body-parser'),
      mongoose              = require('mongoose'),
      expressSession        = require('express-session'),
      passport              = require('passport'),
      localStrategy         = require('passport-local'),
      User                  = require('./models/user');

const app = express();

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
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Landing page
app.get('/', (req, res) => {
    res.render('landing');
})

// INDEX - list all the bunnies
app.get('/bunnies', (req, res) => {
    res.render('index');
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

app.listen(7777, () => {
    console.log('The BunnyGround server is now running...')
})