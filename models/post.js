const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    titolo: String,
    data: Number,
    testo: String,
    media: String, //placeholder
    tag: [String],
    punteggio_post: Number,
    segnalato: Boolean,
    numero_commenti: Number,
    associato_a_contest: [Number],
    creatore_post: String,
    valutazioni: {
        type: Map,
        of: Number,
        default: {}
    }
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;