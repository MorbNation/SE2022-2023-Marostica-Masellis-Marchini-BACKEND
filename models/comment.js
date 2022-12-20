const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    id: Number,
    assoc_id: Number,
    data: String,
    text: String,
    punteggio: Number,
    segnalato: Boolean,
    creatore_commento: String
});

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;