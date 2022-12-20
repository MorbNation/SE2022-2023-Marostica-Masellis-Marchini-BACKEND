const Post = require('../models/post');

const newPost = (req, res) => {
    console.log(req.body);
    console.log('Trying to add new post, checking if a post with the same title exists...');
    Post.findOne({ where: { title: req.body._id } }, (err, data) => {
        if (!data) {
            const newPost = new Post({
                id: req.body.id,
                title: req.body.title,
                date: req.body.req,
                text: req.body.text,
                media: req.body.media,
                tag: req.body.tag,
                punteggio_post: req.body.punteggio_post,
                segnalato: req.body.segnalato,
                numero_commenti: req.body.numero_commenti,
                associato_a_contest: req.body.associato_a_contest,
                creatore_post: req.body.creatore_post
            });

            newPost.save((err, data) => {
                if (err) return res.json({ Error: err });
                return res.json(data);
            });
        } else {
            if (err) return res.json(`Something went wrong. ${err}`);
            return res.json({ message: "Post already exists." });
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