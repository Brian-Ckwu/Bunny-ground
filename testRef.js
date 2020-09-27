const mongoose = require('mongoose'),
      Bunny    = require('./models/bunny'),
      User     = require('./models/user');

mongoose.connect('mongodb://localhost/bunnyground', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connect to the MongoDB!'))
    .catch((err) => console.log(`Fail to connect to the MongoDB: ${err.message}`));

User.findOne({username: 'ckwu4092'}).populate('bunny').exec((err, foundUser) => {
    console.log(foundUser);
})

Bunny.findOne({name: 'Camp Bunny'}).populate('owner').exec((err, foundBunny) => {
    console.log(foundBunny);
})