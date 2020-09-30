const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/bunnyground', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connect to the MongoDB!'))
    .catch((err) => console.log(`Fail to connect to the MongoDB: ${err.message}`));

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