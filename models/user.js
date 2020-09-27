const mongoose              = require('mongoose'),
      passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/bunnyground', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connect to the MongoDB!'))
    .catch((err) => console.log(`Fail to connect to the MongoDB: ${err.message}`));

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    bunny: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bunny'
    }
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;