const mongoose = require('mongoose'),
      Bunny    = require('./models/bunny'),
      User     = require('./models/user');

mongoose.connect('mongodb://localhost/bunnyground', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connect to the MongoDB!'))
    .catch((err) => console.log(`Fail to connect to the MongoDB: ${err.message}`));

User.find({}).populate('bunny').exec((err, users) => {
    console.log(users);
})

Bunny.find({}).populate('owner').exec((err, bunnies) => {
    console.log(bunnies);
})