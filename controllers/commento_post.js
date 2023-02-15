const { collection } = require("../models/commento_post");
const Commento_Post = require("../models/commento_post");

const newCommento_Post = async (req, res) => {
    console.log(req.body);
    console.log('Trying to add new comment...');

    const newCommento_Post = new Commento_Post({
        id: req.body.id,
        id_post: req.body.id_post,
        data: req.body.data,
        testo: req.body.testo,
        punteggio: 0,
        segnalato: false,
        creatore_commento: req.body.creatore_commento
    });

    newCommento_Post.save((err, data) => {
        if (err) return res.json({ Error: err });
        return res.json(data);
    });
};

const getCommento_Post = (req, res) => {
    console.log(req.params);
    let commentAssoc = req.params.id_post;
    var query = { id_post: commentAssoc };
    console.log(`Getting comment with association id ${commentAssoc}...`);

    Commento_Post.find(query, (err, collection) => {
        if (err) {
            throw err;
        } else {
            console.log(`Comment with association id ${commentAssoc} retrieved successfully.`);
            return res.json(collection);
        }
    });
};

const deleteCommento_Post = (req, res) => {
    console.log(req.params);
    let commentId = req.params.id;
    var query = { id: commentId };
    console.log(`Deleting comment with id ${commentId}...`);

    //delete è stupida e a quanto pare non ritorna se la cosa che si prova ad eliminare non esiste, bisognerebbe
    //fare una retireve di support ma chi ha voglia
    Commento_Post.deleteOne(query, (err, collection) => {
        if (err) {
            throw err;
        } else {
            console.log(`Comment with id ${commentId} deleted succesfully.`);
            res.json({ message: "DELETE Comment" });
        }
    });
};

module.exports = { newCommento_Post, getCommento_Post, deleteCommento_Post };