const { collection } = require("../models/comment");
const Comment = require("../models/comment");

const newComment = async (req, res) => {
    console.log(req.body);
    console.log('Trying to add new comment...');

    const newComment = new Comment({
        id: req.body.id,
        assoc_id: req.body.assoc_id,
        data: req.body.data,
        text: req.body.text,
        punteggio: 0,
        segnalato: false,
        creatore_commento: req.body.creatore_commento
    });

    newComment.save((err, data) => {
        if (err) return res.json({ Error: err });
        return res.json(data);
    });
};

const getComment = (req, res) => {
    console.log(req.params);
    let commentAssoc = req.params.assoc_id;
    var query = { assoc_id: commentAssoc };
    console.log(`Getting comment with association id ${commentAssoc}...`);

    Comment.find(query, (err, collection) => {
        if (err) {
            throw err;
        } else {
            console.log(`Comment with association id ${commentAssoc} retrieved successfully.`);
            return res.json(collection);
        }
    });
};

const deleteComment = (req, res) => {
    console.log(req.params);
    let commentId = req.params.id;
    var query = { id: commentId };
    console.log(`Deleting comment with id ${commentId}...`);

    //delete è stupida e a quanto pare non ritorna se la cosa che si prova ad eliminare non esiste, bisognerebbe
    //fare una retireve di support ma chi ha voglia
    Comment.deleteOne(query, (err, collection) => {
        if (err) {
            throw err;
        } else {
            console.log(`Comment with id ${commentId} deleted succesfully.`);
            res.json({ message: "DELETE Comment" });
        }
    });
};

module.exports = { newComment, getComment, deleteComment };