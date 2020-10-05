const mongoose = require('mongoose');

const bunnySchema = new mongoose.Schema({
    name: String,
    sex: String,
    age: Number,
    description: String,
    image: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
})

const Bunny = mongoose.model('Bunny', bunnySchema);

module.exports = Bunny;