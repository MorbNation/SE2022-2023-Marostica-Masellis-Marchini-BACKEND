const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    id: { type: String, unique: true , required: true },
    titolo: { type: String, required: true },
    data: { type: Number, required: true },
    testo: String,
    media: String, //placeholder
    tag: [String],
    punteggio_post: { type: Number, default: 0 },
    segnalato: { type: Boolean, default: false },
    numero_commenti: { type: Number, default: 0 },
    associato_a_contest: [Number],
    creatore_post: { type: String, required: true},
    valutazioni: { type: Map, of: Number, default: {} }
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;