const express    = require('express'),
      bodyParser = require('body-parser');

const app = express();

// Set the ejs file as the default view engine
app.set('view engine', 'ejs');
// Use
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

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
    console.log(req.body);
    res.send('You have submitted the form successfully!');
})

app.listen(7777, () => {
    console.log('The BunnyGround server is now running...')
})