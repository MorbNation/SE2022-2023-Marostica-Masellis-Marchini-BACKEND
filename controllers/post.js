const Post = require('../models/post');

const newPost = (req, res) => {
    console.log(req.body);
    console.log('Trying to add new post, checking if a post with the same title exists...');
    Post.findOne({ title: req.body.title }, (err, data) => {
        if (!data) {
            const newPost = new Post({
                title: req.body.title,
                description: req.body.description,
                author: req.body.author,
                upvotes: req.body.upvotes
            });

            newPost.save((err, data) => {
                if (err) return res.json({ Error: err });
                return res.json(data);
            });
        } else {
            if (err) return res.json(`Something went wrong. ${err}`);
            return res.json({ message: "Post already exists" });
        }
    });
};

const getPost = (req, res) => {
    console.log("Listing all Posts...");
    //gets all posts
    Post.find({}, (err, data) => {
        if (err) {
            return res.json({ Error: err });
        }
        return res.json(data);
    });
};

const deletePost = (req, res) => {
    console.log(req.params);
    let postTitle = req.params.title;
    var query = { title: postTitle };
    console.log(`Deleting post ${postTitle}...`);

    Post.deleteOne(query, (err, collection) => {
        if (err) {
            throw err;
        } else {
            console.log(`Post ${postTitle} deleted succesfully.`);
            res.json({ message: "DELETE Post" });
        }
    });
};

module.exports = { newPost, getPost, deletePost };