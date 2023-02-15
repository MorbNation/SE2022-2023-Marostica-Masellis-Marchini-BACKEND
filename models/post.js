const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    id: Number,
    titolo: String,
    data: String,
    testo: String,
    media: String, //placeholder
    tag: [String],
    punteggio_post: Number,
    segnalato: Boolean,
    numero_commenti: Number,
    associato_a_contest: [Number],
    creatore_post: String
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;