const Post = require('../models/post');

const newPost = (req, res) => {
    console.log('Trying to add new post, checking if a post with the same title exists...');
    Post.findOne({ title: req.body.name }, (err, data) => {
        if(!data){
            const newPost = new Post({
                title: "prova",
                description: "post di test",
                author: "Jesosky",
                upvotes: 0
            });

            newPost.save((err, data) => {
                if(err) return res.json({Error: err});
                return res.json(data);
            });
        } else {
            if(err) return res.json(`Something went wrong. ${err}`);
            return res.json({message: "Post already exists"});
        }
    });
};

const getPost = (req, res) => {
    //placeholder per database shit
    res.json({message: "GET post"});
};

const deletePost = (req, res) => {
    //placeholder per database shit
    res.json({message: "DELETE post"});
};

module.exports = {newPost, getPost, deletePost};