const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {name: String, required: true},
    author: {name: String, required: true},
    description: String,
    tags: String,
    date: {name: String, date: new Date()},
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;