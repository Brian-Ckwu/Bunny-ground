const express = require('express');

const app = express();

// Use the ejs file as the default view engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('landing');
})

app.listen(7777, () => {
    console.log('The BunnyGround server is now running...')
})