const mongoose              = require('mongoose'),
      passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    bunny: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bunny'
    },
    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bunny'
        }
    ]
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;