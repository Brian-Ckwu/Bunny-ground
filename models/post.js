const mongoose = require('mongoose');
  
const postSchema = new mongoose.Schema({
    title: String,
    image: String,
    text: String,
    time: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
})

const Post = mongoose.model('Post', postSchema);

module.exports = Post;