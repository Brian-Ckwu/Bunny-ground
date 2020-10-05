const express               = require('express'),
      bodyParser            = require('body-parser'),
      // Packages required for authentication
      expressSession        = require('express-session'),
      passport              = require('passport'),
      localStrategy         = require('passport-local'),
      User                  = require('./models/user'),
      // Routes
      bunniesRoutes         = require('./routes/bunnies'),
      indexRoutes           = require('./routes/index'),
      postsRoutes           = require('./routes/posts'),
      // MethodOverride
      methodOverride        = require('method-override');
      // SeedDB
      seedDB                = require('./seedDB3');

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
// Use method-override
app.use(methodOverride('_method'));
// Use the routes
app.use('/bunnies', bunniesRoutes);
app.use('/', indexRoutes);
app.use('/bunnies/:id/posts', postsRoutes);

// Listen to the port 7777
app.listen(7777, () => {
    console.log('The BunnyGround server is now running...')
})