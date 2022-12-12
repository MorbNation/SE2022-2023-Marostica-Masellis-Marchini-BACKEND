const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: String,
    description: String,
    author: String,
    upvotes: Number
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;